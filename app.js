// Iports and setup
import { fs } from './fs.js';

window.consoleprint = (t,e)=>{if(e){console.error(t)}else{console.log(t)}};
window.consoleclear = ()=>{};
window.fshrunhook = ()=>{};

// Create fs and run tty
consoleprint('Starting fs');
const FS = new fs();
window.FS = FS;
consoleprint('File system setup finished');
try {
  consoleprint('Running tty');
  let args = [];
  eval(FS.get('/bin/tty.js'));
  try {
    consoleprint('Starting fsh interpreter');
    let args = [];
    eval(FS.get('/bin/fsh.js'));
  } catch(err) {
    consoleprint('Could not load interpreter', true);
  }
  consoleclear()
  consoleprint('Welcome');
  // Start visual desktop
  /*try {
    consoleprint('Starting visual desktop');
    let args = [];
    eval(FS.get('/bin/desktop.js'));
  } catch(err) {
    consoleprint('Could not load desktop', true);
  }*/
  consoleprint('Run "js /bin/dt.js" to start experimental visual desktop');
} catch(err) {
  console.error('Fatal, cannot start tty');
}