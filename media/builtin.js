// Config
export const _desktop = `{
  "background": {
    "type": "color",
    "value": "#181818" 
  },
  "desktop": {
    "rows": 8,
    "columns": 15,
    "apps": [
      {
        "id": "files",
        "x": 0,
        "y": 0
      }
    ]
  },
  "time": "%k:%M:%S"
}`;

// Critical
export const tty = `if (window.interval) clearInterval(window.interval);
document.querySelector('#app').innerHTML = \`<style>
body {
  cursor: text;
  width: 100dvw;
  height: 100dvh;
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
  height: 100dvh;
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
document.body.onclick=()=>{io.focus()};
let last = '';
io.onkeyup=(evt)=>{
  if (evt.key === 'Enter') {
    window.consoleprint('> '+io.value);
    window.fshrunhook(io.value);
    last = io.value;
    io.value = '';
  } else if (evt.key === 'ArrowUp') {
    if (io.value === '') {
      io.value = last;
    }
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

export const desktop = `if (window.interval) clearInterval(window.interval);
document.querySelector('#app').innerHTML = \`<style>
body, #app {
  position: relative;
  width: 100dvw;
  height: 100dvh;
  margin: 0px;
  color: #fff;
  background: #000;
  font-family: Lexend, Arial;
  overflow: hidden;
}
#desktop {
  width: 100dvw;
  height: 95dvh;
  display: grid;
}
#bar {
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  width: 100dvw;
  height: 5dvh;
  background: #0004;
  backdrop-filter: blur(10px);
}
#bar button {
  cursor: pointer;
  min-width: 5dvh;
  height: 5dvh;
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
.cell {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.app {
  width: 100%;
  height: 100%;
}
.app img {
  display: block;
  width: 100%;
  height: calc(100% - 20px);
  pointer-events: none;
}
.app span {
  display: block;
  height: 20px;
  text-align: center;
}
#app .application {
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: #fff4;
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  overflow: hidden;
}
#app .application .header {
  cursor: default;
  flex: 1;
  display: flex;
  padding: 0px 2px;
}
#app .application .header button {
  color: #fff;
  text-shadow: 0px 0px 2px black;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  transition: background 250ms;
}
#app .application .header button:hover {
  background: #d00;
}
#app .application iframe {
  border: none;
  border-radius: 0.5rem;
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
window.openapps = [];
function openApp(id) {
  if(window.openapps.includes(id)) return;
  let info = JSON.parse(FS.get('#/apps/'+id+'.app'));
  window.openapps.push(id);
  let app = document.createElement('div');
  app.id = 'a-'+id;
  app.classList.add('application');
  document.getElementById('app').appendChild(app);
  app.innerHTML = \`<div class="header">
  <span>\${info.name}</span>
  <span style="flex:1"></span>
  <button onclick="closeapp('\${id}')">X</button>
</div>
<iframe></iframe>\`;
  // Size + Position
  let bbb = app.getBoundingClientRect();
  app.style.left = window.innerWidth/2 - bbb.width/2 + 'px';
  app.style.top = window.innerHeight/2 - bbb.height/2 + 'px';
  // Resize
  app.addEventListener('pointermove', (e) => {
    const rect = app.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let cursor = "default";
    const left = x < 10;
    const right = x > rect.width - 10;
    const top = y < 10;
    const bottom = y > rect.height - 10;
    if (top && left) {
      cursor = "nwse";
    } else if (top && right) {
      cursor = "nesw";
    } else if (bottom && left) {
      cursor = "nesw";
    } else if (bottom && right) {
      cursor = "nwse";
    } else if (left) {
      cursor = "ew";
    } else if (right) {
      cursor = "ew";
    } else if (top) {
      cursor = "ns";
    } else if (bottom) {
      cursor = "ns";
    }
    app.style.cursor = cursor+'-resize';
  });
  // Move
  let header = app.querySelector('.header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onpointerdown = (e)=>{
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onpointerup = ()=>{
      document.onpointereup = null;
      document.onpointermove = null;
    };
    document.onpointermove = (e)=>{
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      app.style.top = (app.offsetTop - pos2) + 'px';
      app.style.left = (app.offsetLeft - pos1) + 'px';
    };
  };
  // Inner
  let iframe = app.querySelector('iframe');
  iframe.setAttribute('srcdoc', info.html);
  iframe.contentWindow.FS = window.FS;
}
window.closeapp = (id)=>{
  document.getElementById('a-'+id).remove();
  window.openapps = window.openapps.filter(a=>a!==id);
}
function setDesktop() {
  let desk = document.getElementById('desktop');
  let desktop = JSON.parse(FS.get('~/_desktop.json')).desktop;
  desk.style.gridTemplateRows = 'repeat('+desktop.rows+', 1fr)';
  desk.style.gridTemplateColumns = 'repeat('+desktop.columns+', 1fr)';
  desk.innerHTML = Array.from({ length: desktop.rows*desktop.columns }).map((_,i)=>\`<div class="cell" n="\${i}"></div>\`).join('');
  desktop.apps.forEach(ae=>{
    let app = JSON.parse(FS.get('#/apps/'+ae.id+'.app'));
    document.querySelector('#desktop div.cell[n="'+(ae.x+ae.y*desktop.columns)+'"]').innerHTML = \`<div class="app new" draggable="true">
  <img src="\${app.icon??'./media/app/default.svg'}">
  <span>\${app.name}</span>
</div>\`;
    let icon = document.querySelector('.app.new');
    icon.classList.remove('new');
    icon.onclick = ()=>{openApp(app.id)};
  });
  let grid = document.getElementById('desktop');
  let draggedItem = null;
  grid.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('app')) {
      draggedItem = e.target;
      setTimeout(() => {
        e.target.style.display = "none";
      }, 0);
    }
  });
  grid.addEventListener('dragend', (e) => {
    if (draggedItem) {
      draggedItem.style.display = "block";
      draggedItem = null;
    }
  });
  grid.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('cell') && draggedItem) e.target.append(draggedItem);
  });
}
function setBackground() {
  let bg = JSON.parse(FS.get('~/_desktop.json')).background;
  switch (bg.type) {
    case 'color':
      if (!(/^#[0-9a-fA-F]{3,6}$/).test(bg.value)) {
        throw new Error('Invalid color');
      }
      document.getElementById('app').style.background = bg.value;
      document.getElementById('app').style.setProperty('--bg', bg.value);
      break;
    case 'url':
      if (!(new RegExp('^https?://(www\\.)?[-a-zA-Z0-9@:%\\._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$', 'm')).test(bg.value)) {
        throw new Error('Invalid url');
      }
      document.getElementById('app').style.background = 'url('+bg.value+') center / cover no-repeat';
      document.getElementById('app').style.setProperty('--bg', '#181818');
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
/*
%k:%M             6:25
%k:%M:%S          13:04:21
%l:%M:%S %p       2:10:01 PM
%l:%M:%S %d/%m/%Y 23:00:05 02/06/2025
%H:%M %d/%m/%y    05:00 02/06/25
*/
/* Updates */
setDesktop();
window.interval = setInterval(()=>{
  setBackground();
  setTime();
}, 400);
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
  let max = file.split(\`\n\`).length.toString().length;
  window.consoleprint(file.split(\`\n\`).map((f,i)=>\`\${(i+1).toString().padStart(max, ' ')} \${f}\`).join(\`\n\`));
  window.consoleprint('Uhhh unfinished :D');
}`;