let cmd = 'npm run karma-watch';
const exec = require('child_process').exec;

console.info('running "npm run karma"..');
var execProcess = exec(cmd);
execProcess.stdout.pipe(process.stdout);

