let cmd = 'npm'
let cmdArgs = ['run','karma-watch'];
let spawn = require('cross-spawn');

console.info(`running "${cmd} ${cmdArgs.join(" ")}"..`);

let child = spawn(cmd, cmdArgs, { stdio: 'inherit' });


