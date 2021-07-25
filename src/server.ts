import { ChildProcess, spawn } from "child_process"
import shell from "shelljs"
import { parseConfiguration } from "./adapter/configuration"
import { initSeed, setWorld } from "./adapter/serverProperties"
import { deleteWorldFolder, renameWorldFolder } from "./adapter/world"

async function startServer() {
	setupErrorListeners()

	const configuration = await parseConfiguration()
	const { MIN_RAM, MAX_RAM, OP, WHITELIST, DATA_PACK, SEEDS, AUTO_SAVE, KEEP_WORLDS, LOAD_WORLD, AUTO_RESTART, IGT, AUCTION_BAR_IGT, ALTERNATIVE_START } = configuration

	var time = null
	var endCheck = null
	var timerUpdate = null
	var endVisited = false
	var runDone = false

	if (LOAD_WORLD) {
		await setWorld(LOAD_WORLD)
	} else {
		if (KEEP_WORLDS) {
			renameWorldFolder()
		} else {
			deleteWorldFolder()
		}
		await initSeed(SEEDS, configuration)
	}

	const server = spawn("java", [`-Xms${MIN_RAM}G`, `-Xmx${MAX_RAM}G`, "-jar", "server.jar", "nogui"])
	redirectStdio(server)

	server.stdout.on("data", data => {
		if (data.includes('For help, type "help"')) {
			for (let player of WHITELIST) {
				console.log(`Adding ${player} to whitelist.`)
				server.stdin.write(`/whitelist add ${player}\n`)
			}

			for (let op of OP) {
				console.log(`Making ${op} an operator.`)
				server.stdin.write(`/op ${op}\n`)
			}

			if (!AUTO_SAVE) {
				console.log(`Turning auto-save off.`)
				server.stdin.write("/save-off\n")
			}

			if (DATA_PACK) {
				shell.cp("-Rf", "datapacks/.", "world/datapacks")
				server.stdin.write("/reload\n")
			}
		} else if (IGT) {
			if (data.includes('Set the time to 0') && !runDone) {
				time = Date.now();
				server.stdin.write(`/tellraw @a "§dTime started at §a` + new Date().toLocaleTimeString() + `"\n`)
				if (AUCTION_BAR_IGT) timerUpdate = setInterval(async function(){server.stdin.write(`/title @a actionbar "§dTime: §a` + msToTime(Date.now() - time, false) + `"\n`)}, 1000)
			} else if (ALTERNATIVE_START && data.includes('start run') && !runDone) {
				server.stdin.write(`/time set 0t\n`)
			} else if (data.includes('has made the advancement [The End?]') && !endVisited) {
				endVisited = true
				endCheck = setInterval(async function(){server.stdin.write(`/execute as @a[nbt={Dimension:"minecraft:the_end"}] at @s if block ~ ~ ~ minecraft:end_portal\n`)}, 50)
			} else if (data.includes('Test passed') && !runDone) {
				runDone = true
				clearInterval(endCheck)
				if (AUCTION_BAR_IGT) clearInterval(timerUpdate)
				server.stdin.write(`/tellraw @a "§dTime ended at §a` + msToTime(Date.now() - time, true) + `"\n`)
			}
		}
	})

	server.on("exit", async () => {
		clearInterval(endCheck)
		if (AUCTION_BAR_IGT) clearInterval(timerUpdate)
		server.kill()
		if (AUTO_RESTART) await startServer()
	})
}

function msToTime(duration, ms) {
	var milliseconds = Math.floor((duration % 1000) / 100),
	  seconds = Math.floor((duration / 1000) % 60),
	  minutes = Math.floor((duration / (1000 * 60)) % 60),
	  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
	hours = (hours < 10) ? 0 + hours : hours;
	minutes = (minutes < 10) ? 0 + minutes : minutes;
	seconds = (seconds < 10) ? 0 + seconds : seconds;
  
	return hours + ":" + minutes + ":" + seconds + (ms ?  "." + milliseconds : "");
}

function setupErrorListeners() {
	process.on("uncaughtException", exception => {
		console.log(exception)
		process.exit(1)
	})

	process.on("unhandledRejection", rejection => {
		console.log(rejection)
		process.exit(1)
	})
}

function redirectStdio(childProcess: ChildProcess) {
	childProcess.stdout.pipe(process.stdout)
	childProcess.stderr.pipe(process.stderr)
	process.stdin.pipe(childProcess.stdin)
}

startServer()
