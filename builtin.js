// Config
export const _desktop = `{
  "background": {
    "type": "color",
    "value": "#181818" 
  }
}`;

// Critical
export const tty = `document.querySelector('#app').innerHTML = \`<style>
body {
  cursor: text;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  color: #fff;
  background: #000;
  overflow: hidden auto;
}
p {
  margin: 0px;
  white-space: break-spaces;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 5px;
  box-sizing: border-box;
}
code {
  display: block;
}
input {
  border: none;
  outline: none;
  background: transparent;
}
code, input {
  color: #fff;
  font-size: 14px;
  font-family: monospace;
  margin: 0px;
  padding: 0px;
}
p.e {
  color: #d66;
}
</style>
<code></code>
<input autocapitalize="off" name="command">\`;
window.consoleprint=(text, error)=>{
  if(error){console.error(text)}else{console.log(text)};
  document.querySelector('code').innerHTML += '<p'+(error?' class="e">':'>')+text.toString().replaceAll('<','&lt;')+'</p>';
}
window.consoleclear=(text)=>{
  Array.from(document.querySelectorAll('code p:not(.e)')).forEach(e=>e.remove());
}
let io = document.querySelector('input');
document.body.onclick=()=>{io.select()};
io.onkeyup=(evt)=>{
  if (evt.key==='Enter') {
    window.consoleprint('> '+io.value);
    window.fshrunhook(io.value);
    io.value = '';
  }
}
consoleprint('Running tty mode');`;

export const fsh = `if (args.length) {
  try {
    window.fshrunhook(FS.get(args[0]));
  } catch(err) {
    window.consoleprint(err, true);
  }
} else {
  window.fshrunhook=(c)=>{
    let args = c.split(' ');
    let cmd = args.shift();
    try {
      eval(FS.get('/bin/'+cmd+'.js'))
    } catch(err) {
      window.consoleprint(err, true);
    }
  }
  window.consoleprint('Sarted fsh interpreter')
}`;

export const desktop = `document.querySelector('#app').innerHTML = \`<style>
body, #app {
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  color: #fff;
  background: #000;
  overflow: hidden;
}
#desktop {
  width: 100vw;
  height: 100vh;
}
#bar {
  position: absolute;
  right: 0px;
  bottom: 0px
  left: 0px;
  width: 100vw;
  height: 5vh;
  background: #0008;
}
</style>
<div id="desktop"></div>
<div id="bar"></div>\`;
window.consoleprint = (t,e)=>{if(e){console.error(t)}else{console.log(t)}};
window.consoleclear = ()=>{};
document.body.onclick=()=>{};
function setBackground() {
  let bg = JSON.parse(FS.get('~/_desktop.json')).background;
  switch (bg.type) {
    case 'color':
      if (!(/^#[0-9a-fA-F]{3,6}$/).test(bg.value)) {
        throw new Error('Invalid color');
      }
      document.getElementById('app').style.background = bg.value;
      break;
  }
}
setBackground();
consoleprint('Loaded desktop');`;

// Commands
export const js = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    let file = FS.get(args[0]);
    if (Array.isArray(file)) thow new Error('Cannot be directory');
    eval(file);
  } catch(err) {
    window.consoleprint(err, true);
  }
}`;

export const view = `let v = '/';
if (args[0]) v = args[0];
try {
  let ff = FS.get(v);
  if (Array.isArray(ff)) {
    ff = ff.map(f=>'| '+f).join('\\n');
  }
  window.consoleprint(v);
  window.consoleprint(ff);
} catch(err) {
  window.consoleprint(err, true);
}`;

export const edit = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    let file = FS.get(args[0]);
    if (Array.isArray(file)) thow new Error('Cannot be directory');
  } catch(err) {
    if (err.includes('Missing directory/file')) {
      FS.create(args[0]);
      file = ''
    } else {
      window.consoleprint(err, true);
    }
  }
  file.split('\n').map((f,i)=>\`\${i+1} \${f}\`);
  window.consoleprint('Uhhh unfinished :D');
}`;