/**
 * 
 * miza
 * by @txin - port by @hucario
 * 
 * index file:
 * Makes sure all dependencies are installed
 * runs bot as subprocess, checks for health, and relaunches if needed
 */
import con from './src/common/logging.js'
import { dirname } from 'path'
import dnode from 'dnode';
import envConfig from './config.env.js'
import depsOk from 'deps-ok';
import { fork } from 'child-process'

// why do modules make me have to do this. this is pain.
const __dirname = dirname(import.meta.url.replace('file:///', ''));

// #region Check dependencies

con.verbose("Checking dependencies")
const depsAlright = depsOk(__dirname, {
	verbose: false
})
if (!depsAlright) {
	con.error(`There's something wrong with your dependencies. Have you run \`npm i\`?
- ${depsAlright}`)
} else {
	con.verbose("Dependencies checked, appear to be fine.")
}

// #endregion

const SUBPROCESSES = [
	'./src/bot.js',
	'./src/webserver.js'
]

// #region Heartbeat
let children = [];

con.verbose('Initializing dnode')
const d = dnode(envConfig.dnodePort, {
	weak: false
});
d.on('remote', (child) => {
	con.verbose('dnode: something connected')
	child.idSelf((id) => {
		con.verbose(`dnode: "something" identified as "${id}"`)
		children[id] = child;
		confirmChild(child);
	})
})
function confirmChild(tChild) {
	let timeoutID = setTimeout(() => {
		con.error(`dnode: Child "${id}" has timed out. (${envConfig.heartbeatGrace}ms past asking for confirmation)`)
	})
	tChild.confirmAlive(() => {
		clearTimeout(timeoutID);
		con.verbose(`dnode: Child "${id}" is alive.`)
	});
}

let hbExpiredTimeouts = {};

// #endregion