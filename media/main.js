// Iports and setup
import { fs } from './fs.js';

window.consoleprint = (t,e)=>{if(e){console.error(t)}else{console.log(t)}};
window.consoleclear = ()=>{};
window.fshrunhook = ()=>{};

// Create fs and run tty
consoleprint('Starting fs');
const FS = new fs();
await FS.fillBinary();
window.FS = FS;
consoleprint('File system setup finished');
try {
  consoleprint('Starting fsh interpreter');
  let args = [];
  eval(FS.get('#/fsh.js'));
  try {
    consoleclear();
    consoleprint('Running tty');
    window.fshrunhook('tty');
    try {
      window.fshrunhook('dt');
    } catch(err) {
      consoleprint('Could not load desktop', true);
    }
  } catch(err) {
    console.error('Fatal, cannot start tty', true);
  }
} catch(err) {
  consoleprint('Fatal, cannot start interpreter', true);
}