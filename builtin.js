// Config
export const _desktop = `{
  "background": {
    "type": "color",
    "value": "#181818" 
  },
  "time": "%k:%M:%S"
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
    window.consoleprint('Error executing fsh file\\n'+err, true);
  }
} else {
  window.fshrunhook=(c)=>{
    let args = c.split(' ');
    let cmd = args.shift();
    try {
      eval(FS.get('#/'+cmd+'.js'));
    } catch(err) {
      window.consoleprint(\`Error executing fsh\n\`+err, true);
    }
  }
  window.consoleprint('Sarted fsh interpreter');
}`;

export const desktop = `document.querySelector('#app').innerHTML = \`<style>
body, #app {
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0px;
  color: #fff;
  background: #000;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
#desktop {
  width: 100vw;
  height: 100vh;
}
#bar {
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  width: 100vw;
  height: 5vh;
  background: #0004;
  backdrop-filter: blur(10px);
}
#bar button {
  cursor: pointer;
  min-width: 5vh;
  height: 5vh;
  color: #fff;
  padding: 5px;
  border: none;
  background: #0000;
  transition: 500ms;
}
#bar button:hover {
  background: #0004;
}
#bar button img {
  width: 100%;
  height: 100%;
}
</style>
<div id="desktop"></div>
<div id="bar">
  <button><img src="./media/logo.png"></button>
  <span style="display:block;flex:1;"></span>
  <button inert id="time"></button>
</div>\`;
window.consoleprint = (t,e)=>{if(e){console.error(t)}else{console.log(t)}};
window.consoleclear = ()=>{};
document.body.onclick=()=>{};
/* Functions */
function setBackground() {
  let bg = JSON.parse(FS.get('~/_desktop.json')).background;
  switch (bg.type) {
    case 'color':
      if (!(/^#[0-9a-fA-F]{3,6}$/).test(bg.value)) {
        throw new Error('Invalid color');
      }
      document.getElementById('app').style.background = bg.value;
      break;
    case 'url':
      if (!(new RegExp('^https?://(www\\.)?[-a-zA-Z0-9@:%\\._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$', 'm')).test(bg.value)) {
        throw new Error('Invalid url');
      }
      document.getElementById('app').style.background = 'url('+bg.value+')';
      break;
  }
}
function setTime() {
  let time = JSON.parse(FS.get('~/_desktop.json')).time;
  let date = new Date();
  document.getElementById('time').innerText = time
    .replaceAll('%H',date.getHours().toString().padStart(2, '0'))
    .replaceAll('%k',date.getHours())
    .replaceAll('%I',(date.getHours()?date.getHours()%12:12).toString().padStart(2, '0'))
    .replaceAll('%l',(date.getHours()?date.getHours()%12:12))
    .replaceAll('%p',date.getHours()>=12?'PM':'AM')
    .replaceAll('%P',date.getHours()>=12?'pm':'am')
    .replaceAll('%M',date.getMinutes().toString().padStart(2, '0'))
    .replaceAll('%-M',date.getMinutes())
    .replaceAll('%S',date.getSeconds().toString().padStart(2, '0'))
    .replaceAll('%-S',date.getSeconds())
    .replaceAll('%d',(date.getDay()+1).toString().padStart(2, '0'))
    .replaceAll('%-d',date.getDay()+1)
    .replaceAll('%m',(date.getMonth()+1).toString().padStart(2, '0'))
    .replaceAll('%-m',date.getMonth()+1)
    .replaceAll('%Y',date.getFullYear())
    .replaceAll('%y',date.getFullYear()%100);
}
/*%k:%M             6:25
%k:%M:%S          13:04:21
%l:%M:%S %p       2:10:01 PM
%l:%M:%S %d/%m/%Y 23:00:05 02/06/2025
%H:%M %d/%m/%y    05:00 02/06/25*/
/* Updates */
let interval = setInterval(()=>{
  setBackground();
  setTime();
}, 400)
consoleprint('Loaded desktop');`;

// Commands
export const js = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    let file = FS.get(args[0]);
    if (Array.isArray(file)) throw new Error('Cannot be directory');
    eval(file);
  } catch(err) {
    window.consoleprint(\`Error executing js\n\`+err, true);
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
  let file = '';
  try {
    file = FS.get(args[0]);
    if (Array.isArray(file)) throw new Error('Cannot be directory');
  } catch(err) {
    if (err.includes('Missing directory/file')) {
      FS.create(args[0]);
      file = ''
    } else {
      window.consoleprint(err, true);
    }
  }
  window.consoleprint(file.split(\`\n\`).map((f,i)=>\`\${i+1} \${f}\`));
  window.consoleprint('Uhhh unfinished :D');
}`;