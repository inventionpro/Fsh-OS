// Critical
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
p.err {
  color: #d66;
}
</style>
<code></code>
<input autocapitalize="off" name="command">\`;
window.consoleprint=(text, error)=>{
  if(error){console.error(text)}else{console.log(text)};
  document.querySelector('code').innerHTML += '<p'+(error?' class="err">':'>')+text.toString().replaceAll('<','&lt;')+'</p>';
}
window.consoleclear=(text)=>{
  Array.from(document.querySelectorAll('code p:not(.e)')).forEach(e=>e.remove());
}
let io = document.querySelector('input');
document.body.onclick=()=>{io.focus()};
let last = '';
io.onkeyup=(evt)=>{
  if (evt.key === 'Enter') {
    io.value = io.value.trim();
    window.consoleprint('> '+io.value);
    if (io.value==='') return;
    window.fshrunhook(io.value);
    last = io.value;
    io.value = '';
  } else if (evt.key === 'ArrowUp') {
    if (io.value === '') io.value = last;
  }
}
consoleprint('Running tty mode');`;

// Config
export const _desktop = `{
  "background": {
    "type": "file",
    "value": "~/default_background.png"
  },
  "desktop": {
    "rows": 8,
    "columns": 15,
    "apps": [
      {
        "id": "notepad",
        "x": 0,
        "y": 0
      },
      {
        "id": "files",
        "x": 0,
        "y": 1
      },
      {
        "id": "config",
        "x": 0,
        "y": 2
      }
    ]
  },
  "time": "%k:%M:%S\\n%d/%m/%Y"
}`;
export const _permissions = `{
  "unsandboxed": [],
  "protected": ["/bin/tty.js", "/bin/fsh.js", "/bin/dt.js", "/config/permissions.json"],

  "fs": ["files", "notepad", "viewer", "config"],
  "fs_protected": ["notepad", "config"],
  "commands": ["terminal"],
  "usermedia": [],
  "geolocation": []
}`;
export const _openers = `{
  "@": ["notepad", "viewer"],

  "js": ["notepad"],
  "json": ["notepad"],
  "txt": ["notepad"],

  "png": ["viewer"],
  "apng": ["viewer"],
  "jpg": ["viewer"],
  "jpeg": ["viewer"],
  "jfif": ["viewer"],
  "ico": ["viewer"],
  "gif": ["viewer"], 
  "webp": ["viewer"],
  "bmp": ["viewer"],
  "svg": ["viewer"],
  "avif": ["viewer"],

  "mp4": ["viewer"],
  "m4v": ["viewer"],
  "webm": ["viewer"],
  "mov": ["viewer"],
  "mkv": ["viewer"]
}`;

// Commands
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
h1, h2, h3 { margin: 0px; }
hr { border: 1px currentColor solid; }
button {
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  border: none;
  border-radius: 0.25rem;
  transition: 250ms;
}
dialog {
  color: inherit;
  font-family: inherit;
  border: none;
  border-radius: 0.5rem;
  background-color: #0008;
}
::backdrop {
  backdrop-filter: blur(4px);
}
#selector div {
  display: flex;
  gap: 5px;
  flex-direction: column;
}
#selector button {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0px;
  background: #222;
  overflow: hidden;
}
#desktop {
  display: grid;
  grid-template-rows: repeat(var(--rows, 8), 1fr);
  grid-template-columns: repeat(var(--columns, 15), 1fr);
  width: 100dvw;
  height: 95dvh;
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
  z-index: 9999999999999;
}
#bar > button {
  min-width: 5dvh;
  height: 5dvh;
  padding: 5px;
  background: #0000;
}
#bar > button:hover {
  background: #0004;
}
#bar > button img {
  width: 100%;
  height: 100%;
}
#search {
  position: absolute;
  bottom: 5dvh;
  left: 0px;
  width: 20dvw;
  height: 30dvh;
  padding: 10px;
  border-radius: 0 1rem 0 0;
  background: #0006;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}
#search input {
  width: 100%;
  min-width: 0px;
  color: #fff;
  margin: 0px;
  padding: 4px 6px;
  border: none;
  border-radius: 0.5rem;
  background: #fff1;
  box-sizing: border-box;
}
#search div {
  display: flex;
  flex-direction: column;
}
#search button {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 5px;
  background: none;
}
#search button:hover {
  background: #0008;
}
#open-apps {
  display: flex;
  gap: 5px;
  align-items: center;
  height: 100%;
  user-select: none;
}
#open-apps button {
  height: 80%;
  padding: 0px;
  background: none;
}
#open-apps img {
  height: 100%;
  aspect-ratio: 1/1;
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
  text-overflow: ellipsis;
  overflow: hidden;
}
#app .application {
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 250px;
  padding: 4px;
  background-color: #6664;
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0px 0px 2px black;
  box-sizing: border-box;
}
#app .application .header {
  cursor: default;
  flex: 1;
  display: flex;
  padding: 0px 2px;
  user-select: none;
}
#app .application .header span {
  text-shadow: 0px 0px 2px black;
}
#app .application .header button {
  text-shadow: 0px 0px 2px black;
  background: transparent;
}
#app .application .header button:hover {
  background: #d00;
}
#app .application iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.5rem;
  user-select: none;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: currentColor;
}
</style>
<dialog closedby="any" id="selector">
  <h2>How to open "<span></span>"</h2>
  <hr>
  <div></div>
</dialog>
<div id="desktop"></div>
<div id="bar">
  <div id="search" style="display:none">
    <input placeholder="Search..." name="app-search">
    <div></div>
  </div>
  <button id="logo"><img src="./media/logo.png"></button>
  <div id="open-apps"></div>
  <span style="display:block;flex:1;"></span>
  <button inert id="time"></button>
</div>\`;
window.consoleprint = (txt,err)=>{
  console[err?'error':'log'](txt);
  let permissions = JSON.parse(FS.get('@/permissions.json'));
  window.openapps.forEach(app=>{
    if (!permissions.commands.includes(app.app)) return;
    app.iframe.contentWindow.postMessage({
      type: 'cmd',
      action: 'send',
      content: txt,
      err
    }, '*');
  });
};
window.consoleclear = ()=>{
  let permissions = JSON.parse(FS.get('@/permissions.json'));
  window.openapps.forEach(app=>{
    if (!permissions.commands.includes(app.app)) return;
    app.iframe.contentWindow.postMessage({
      type: 'cmd',
      action: 'clear'
    }, '*');
  });
};
document.body.onclick=()=>{};
/* Functions */
window.openapps = [];
window.topAppZ = 0;
window.openApp = (id, attributes={})=>{
  let processid = Math.floor(Math.random()*0xFFFFFF).toString(16);
  let info = JSON.parse(FS.get('#/apps/'+id+'.app'));
  window.openapps.push({ pid: processid, app: id });
  window.showOpenApps();
  let app = document.createElement('div');
  app.id = 'a-'+processid;
  app.classList.add('application');
  app.style.zIndex = ++window.topAppZ;
  document.getElementById('app').appendChild(app);
  app.innerHTML = \`<div class="header">
  <span>\${info.name}</span>
  <span style="flex:1"></span>
  <button onclick="closeapp('\${processid}')">X</button>
</div>
<iframe></iframe>\`;
  let iframe = app.querySelector('iframe');
  // Z index
  let moveToTop = ()=>{
    if (window.topAppZ!=app.style.zIndex) app.style.zIndex = ++window.topAppZ;
  };
  app.moveToTop = moveToTop;
  app.addEventListener('focusin', moveToTop);
  // Size + Position
  app.style.left = window.innerWidth/2-200 + 'px';
  app.style.top = window.innerHeight/2-125 + 'px';
  app.style.width = '400px';
  app.style.height = '250px';
  // Resize
  let resizing;
  let moving = false;
  app.onpointerdown = (evt)=>{
    if (moving) return;
    moveToTop();
    const rect = app.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const left = x < 10;
    const right = x > rect.width - 10;
    const top = y < 10;
    const bottom = y > rect.height - 10;
    if (left||right||top||bottom) {
      app.setPointerCapture(evt.pointerId);
      resizing = { id: evt.pointerId, x: evt.clientX, y: evt.clientY, left, right, top, bottom };
    }
  };
  app.onpointerup = (evt)=>{
    if (resizing && resizing.id===evt.pointerId) {
      app.releasePointerCapture(evt.pointerId);
      resizing = null;
    }
  };
  app.onpointermove = (evt)=>{
    let rect = app.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    let left;
    let right;
    let top;
    let bottom;
    if (resizing && resizing.id===evt.pointerId) {
      ({ left, right, top, bottom } = resizing);
    } else {
      left = x < 10;
      right = x > rect.width - 10;
      top = y < 10;
      bottom = y > rect.height - 10;
    }
    let cursor = '';
    if ((top && left) || (bottom && right)) {
      cursor = 'nwse';
    } else if ((top && right) || (bottom && left)) {
      cursor = 'nesw';
    } else if (left || right) {
      cursor = 'ew';
    } else if (top || bottom) {
      cursor = 'ns';
    }
    app.style.cursor = cursor.length?cursor+'-resize':'';
    if (resizing && resizing.id===evt.pointerId) {
      let l = Number(app.style.left.replace('px',''));
      let t = Number(app.style.top.replace('px',''));
      let w = Number(app.style.width.replace('px',''));
      let h = Number(app.style.height.replace('px',''));
      let dx = evt.clientX-resizing.x;
      let dy = evt.clientY-resizing.y;
      if (right) w += dx;
      if (bottom) h += dy;
      if (left) {
        l += dx;
        w -= dx;
      }
      if (top) {
        t += dy;
        h -= dy;
      }
      if (left||right) {
        resizing.x = evt.clientX;
        app.style.left = l+'px';
        app.style.width = w+'px';
      }
      if (top||bottom) {
        resizing.y = evt.clientY;
        app.style.top = t+'px';
        app.style.height = h+'px';
      }
    }
  };
  // Move
  let header = app.querySelector('.header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onpointerdown = (e)=>{
    if (e.target.tagName==='BUTTON') return;
    moveToTop();
    moving = true;
    header.setPointerCapture(e.pointerId);
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onpointerup = ()=>{
      moving = false;
      header.releasePointerCapture(e.pointerId);
      document.onpointereup = null;
      document.onpointermove = null;
    };
    document.onpointermove = (e)=>{
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      app.style.left = (app.offsetLeft - pos1) + 'px';
      app.style.top = (app.offsetTop - pos2) + 'px';
    };
  };
  // Inner
  window.openapps[window.openapps.findIndex(app=>app.pid===processid)].iframe = iframe;
  let prepend = \`<script>
  window.startAttributes = \${JSON.stringify(attributes||{})};
</script>
<style>
body {
  font-family: Lexend, Arial, sans-serif;
  color: #ddd;
  width: 100dvw;
  height: 100dvh;
  margin: 0px;
  overflow: hidden;
}
svg {
  fill: currentColor;
  outline: currentColor;
}
button {
  cursor: pointer;
  font-family: inherit;
  text-align: start;
  color: currentColor;
  border: none;
  transition: background 250ms;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: currentColor;
}
</style>\`;
  let permissions = JSON.parse(FS.get('@/permissions.json'));
  if (!permissions.unsandboxed.includes(id)) {
    iframe.setAttribute('sandbox', 'allow-downloads allow-modals allow-pointer-lock allow-presentation allow-scripts');
    let geolocation = permissions.geolocation.includes(id)?'geolocation; ':"geolocation 'none'; ";
    let usermedia = permissions.usermedia.includes(id)?'camera; microphone; ':"camera 'none'; microphone 'none'; ";
    iframe.setAttribute('allow', usermedia+geolocation+"autoplay; bluetooth; captured-surface-control; compute-pressure; cross-origin-isolated; deferred-fetch; deferred-fetch-minimal; display-capture; encrypted-media; fullscreen; gamepad; hid; local-fonts; midi; picture-in-picture; screen-wake-lock; serial; usb; web-share; xr-spatial-tracking; accelerometer 'none'; ambient-light-sensor 'none'; attribution-reporting 'none'; browsing-topics 'none'; ch-ua-high-entropy-values 'none'; gyroscope 'none'; identity-credentials-get 'none'; idle-detection 'none'; local-network 'none'; local-network-access 'none'; loopback-network 'none'; magnetometer 'none'; on-device-speech-recognition 'none'; otp-credentials 'none'; payment 'none'; private-state-token-issuance 'none'; private-state-token-redemption 'none'; publickey-credentials-create 'none'; publickey-credentials-get 'none'; storage-access 'none'; summarizer 'none'; window-management 'none'");
    function handler(evt) {
      if (evt.source!==iframe.contentWindow) return;
      if (!evt.data||!evt.data.type) return;
      let type = evt.data.type;
      if (type==='close') {
        window.closeapp(processid);
      } else if (type==='openFile') {
        window.openfile(evt.data.path);
      } else if (type==='fs'&&permissions.fs.includes(id)) {
        if (!['get','set','create','delete'].includes(evt.data.action)) return;
        if (!permissions.fs_protected.includes(id)) {
          let abspath = window.FS.abs(evt.data.path);
          if (permissions.protected.includes(abspath)) return;
          if ((/\\/bin\\/apps\\/[^/]*?\\.app/).test(abspath)&&permissions.fs_protected.includes(abspath.match(/apps\\/([^\\/]*?)\\.app/)[1])) return;
        };
        let args = [evt.data.path];
        if (evt.data.action==='set') args.push(evt.data.data);
        let h = window.FS[evt.data.action](...args);
        let response = {
          type: 'fs',
          action: evt.data.action,
          path: evt.data.path
        };
        if (evt.data.action==='get') response.data = h;
        iframe.contentWindow.postMessage(response, '*');
      } else if (type==='cmd'&&permissions.commands.includes(id)) {
        window.fshrunhook(evt.data.command);
      }
    }
    window.openapps[window.openapps.findIndex(app=>app.pid===processid)].handler = handler;
    window.addEventListener('message', handler);
    prepend+=\`<script>
  function _sendAndAwaitFS(action, path, value) {
    return new Promise((resolve)=>{
      function manage(evt) {
        if (evt.data.type!=='fs') return;
        if (evt.data.action!==action) return;
        if (evt.data.path!==path) return;
        window.removeEventListener('message', manage);
        resolve(action==='get'?evt.data.data:null);
      }
      window.addEventListener('message', manage);
      window.top.postMessage({
        type: 'fs',
        action: action,
        path: path,
        ...(action==='set'?{ data: value }:{})
      }, '*');
    });
  }
  window.FS = {
    get: (path)=>_sendAndAwaitFS('get',path),
    set: (path,value)=>_sendAndAwaitFS('set',path,value),
    create: async(path)=>_sendAndAwaitFS('create',path),
    delete: async(path)=>_sendAndAwaitFS('delete',path)
  };
  window.openFile = (path)=>{
    window.top.postMessage({
      type: 'openFile',
      path: path
    }, '*');
  };
  window.close = ()=>{
    window.top.postMessage({ type: 'close' }, '*');
  };
  window.runCommand = (cmd)=>{
    window.top.postMessage({
      type: 'cmd',
      command: cmd
    }, '*');
  };
  window.consoleprint = ()=>{};
  window.consoleclear = ()=>{};
  window.addEventListener('message', (evt)=>{
    if (evt.data.type!=='cmd') return;
    if (evt.data.action==='clear') {
      window.consoleclear();
    } else {
      window.consoleprint(evt.data.content, evt.data.err);
    }
  });
</script>\`;
  }
  iframe.setAttribute('srcdoc', prepend+info.html);
}
window.onblur = ()=>{
  setTimeout(()=>{
    if (document.activeElement.tagName==='IFRAME') document.activeElement.parentElement.moveToTop();
  }, 0);
};
window.closeapp = (id)=>{
  document.getElementById('a-'+id).remove();
  let handler = window.openapps.find(app=>app.pid===id).handler;
  if (handler) window.removeEventListener('message', handler);
  window.openapps = window.openapps.filter(app=>app.pid!==id);
  window.showOpenApps();
}
window.openfile = (file)=>{
  let openers = JSON.parse(FS.get('@/openers.json'));
  let ext = file.split('.')[1];
  if (!openers[ext]) ext = '@';
  if (openers[ext].length===1) {
    window.top.openApp(openers[ext][0], { file });
  } else {
    let selector = document.getElementById('selector');
    selector.showModal();
    selector.querySelector('span').innerText = file;
    selector.querySelector('div').innerHTML = openers[ext]
      .map(app=>JSON.parse(FS.get('#/apps/'+app+'.app')))
      .map(app=>'<button onclick="window.openApp(\\''+app.id+'\\', { file: \\''+file+'\\' });document.getElementById(\\'selector\\').close()"><img src="'+app.icon+'" width="50" height="50" aria-hidden="true">'+app.name+'</button>')
      .join('');
  }
};
window.setDesktop = ()=>{
  let desk = document.getElementById('desktop');
  let desktop = JSON.parse(FS.get('@/desktop.json')).desktop;
  desk.style.setProperty('--rows', desktop.rows);
  desk.style.setProperty('--columns', desktop.columns);
  desk.innerHTML = Array.from({ length: desktop.rows*desktop.columns }).map((_,i)=>\`<div class="cell" n="\${i}"></div>\`).join('');
  desktop.apps.forEach(ae=>{
    let app = JSON.parse(FS.get('#/apps/'+ae.id+'.app'));
    document.querySelector('#desktop div.cell[n="'+(ae.x+ae.y*desktop.columns)+'"]').innerHTML = \`<div class="app new" draggable="true">
  <img src="\${app.icon??'./media/app/default.svg'}">
  <span>\${app.name}</span>
</div>\`;
    let icon = document.querySelector('.app.new');
    icon.classList.remove('new');
    icon.onclick = ()=>{window.openApp(app.id)};
  });
  // Grid
  let draggedItem = null;
  desk.ondragstart = (evt)=>{
    if (evt.target.classList.contains('app')) {
      draggedItem = evt.target;
      setTimeout(() => {
        evt.target.style.display = 'none';
      }, 0);
    }
  };
  desk.ondragend = (evt)=>{
    if (draggedItem) {
      draggedItem.style.display = 'block';
      draggedItem = null;
    }
  };
  desk.ondragover = (evt)=>{
    evt.preventDefault();
  };
  desk.ondrop = (evt)=>{
    evt.preventDefault();
    if (evt.target.classList.contains('cell') && draggedItem) evt.target.append(draggedItem);
  };
}
window.setSearch = ()=>{
  let apps;
  let appindex;
  document.addEventListener('click', (evt)=>{
    const div = document.getElementById('bar');
    if (!div?.contains(evt.target)) document.getElementById('search').style.display = 'none';
  });
  document.getElementById('logo').onclick = ()=>{
    document.getElementById('search').style.display = '';
  };
  document.querySelector('#search input').oninput = (evt)=>{
    if (JSON.stringify(appindex)!==JSON.stringify(FS.get('#/apps'))) {
      appindex = window.FS.get('#/apps');
      apps = appindex.map(app=>JSON.parse(FS.get('#/apps/'+app)));
    }
    let query = document.querySelector('#search input').value.toLowerCase();
    document.querySelector('#search div').innerHTML = apps
      .filter(app=>app.name.toLowerCase().includes(query))
      .toSorted((a,b)=>a.name.localeCompare(b.name))
      .map(app=>\`<button onclick="window.openApp('\${app.id}');document.getElementById('search').style.display='none'"><img src="\${app.icon}" width="20" height="20" loading="lazy">\${app.name}</button>\`)
      .join('');
  };
  document.querySelector('#search input').oninput();
};
window.showOpenApps = ()=>{
  let apps = new Set();
  window.openapps.forEach(app=>apps.add(app.app));
  document.getElementById('open-apps').innerHTML = Array.from(apps).map(app=>\`<button onclick="document.getElementById('a-\${window.openapps.find(ap=>ap.app===app).pid}').style.zIndex=++window.topAppZ"><img src="\${JSON.parse(FS.tree.bin.apps[app+'.app']).icon}"></button>\`).join('');
}
window.lastDesktop = '';
window.lastBackground = '';
window.lastBackgroundURL = '';
window.setBackground = ()=>{
  let desktop = JSON.parse(FS.get('@/desktop.json'));
  if (window.lastDesktop!==desktop.desktop.rows+'-'+desktop.desktop.columns) {
    window.lastDesktop = desktop.desktop.rows+'-'+desktop.desktop.columns;
    window.setDesktop();
  }
  let bg = desktop.background;
  if (window.lastBackground===bg.value) return;
  window.lastBackground = bg.value;
  if (window.lastBackgroundURL) {
    URL.revokeObjectURL(window.lastBackgroundURL);
    window.lastBackgroundURL = '';
  }
  switch (bg.type) {
    case 'color':
      if (!(/^#[0-9a-fA-F]{3,6}$/).test(bg.value)) throw new Error('Invalid color');
      document.getElementById('app').style.background = bg.value;
      document.getElementById('app').style.setProperty('--bg', bg.value);
      break;
    case 'url':
      if (!(new RegExp('^https?:\\/\\/(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_+.~#?&\\\\/\\\\/=]*)$|^data:[\\\\w\\\\/+.-]+;\\\\w+,.*$', 'mi')).test(bg.value)) throw new Error('Invalid url');
      document.getElementById('app').style.background = 'url('+bg.value+') center / cover no-repeat';
      document.getElementById('app').style.setProperty('--bg', '#181818');
      break;
    case 'file':
      window.lastBackgroundURL = URL.createObjectURL(FS.get(bg.value));
      document.getElementById('app').style.background = 'url('+window.lastBackgroundURL+') center / cover no-repeat';
      document.getElementById('app').style.setProperty('--bg', '#181818');
      break;
  }
}
window.setTime = ()=>{
  let time = JSON.parse(FS.get('@/desktop.json')).time;
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
/* Updates */
window.setDesktop();
window.setSearch();
window.setBackground();
window.setTime();
window.interval = setInterval(()=>{
  window.setBackground();
  window.setTime();
}, 400);
window.consoleprint('Loaded desktop');`;

export const js = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    let file = window.FS.get(args[0]);
    if (Array.isArray(file)) throw new Error('Cannot be directory');
    eval(file);
  } catch(err) {
    window.consoleprint(\`Error executing js\n\`+err, true);
  }
}`;

export const clear = 'window.consoleclear()';

export const tree = `if (!args[0]) {
  window.consoleprint('Select option, save/load', true);
} else {
  if (args[0]==='save') {
    let a = document.createElement('a');
    a.href = 'data:application/json,'+encodeURIComponent(JSON.stringify(FS.tree));
    a.download = 'fshos-'+Date.now()+'.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else if (args[0]==='load') {
    let file = document.createElement('input');
    file.type = 'file';
    file.accept = 'application/json';
    file.style.display = 'none';
    document.body.appendChild(file);
    file.onchange = ()=>{
      const reader = new FileReader();
      reader.onload = ()=>{
        window.FS.tree = JSON.parse(reader.result);
        file.remove();
      };
      reader.readAsText(file.files[0], 'UTF-8');
    };
    file.click();
  } else {
    window.consoleprint('Unknown option, save/load', true);
  }
}`;

export const view = `let v = '/';
if (args[0]) v = args[0];
try {
  let ff = window.FS.get(v);
  if (Array.isArray(ff)) {
    ff = ff.map(f=>'| '+f).join('\\n');
  }
  window.consoleprint(v);
  window.consoleprint(ff);
} catch(err) {
  window.consoleprint(err, true);
}`;

export const make = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    window.FS.create(args[0]);
    window.consoleprint('created '+args[0]);
  } catch(err) {
    window.consoleprint(err, true);
  }
}`;

export const edit = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  let file = '';
  let run = true;
  try {
    file = window.FS.get(args[0]);
    if (Array.isArray(file)) throw new Error('Cannot be directory');
  } catch(err) {
    if (err.message.includes('Missing directory/file')) {
      window.FS.create(args[0]);
      file = ''
    } else {
      window.consoleprint(err.message, true);
      run = false;
    }
  }
  if (run) {
    let max = file.split(\`\n\`).length.toString().length;
    window.consoleprint(file.split(\`\n\`).map((f,i)=>\`\${(i+1).toString().padStart(max, ' ')} \${f}\`).join(\`\n\`));
    window.consoleprint('Uhhh unfinished :D');
  }
}`;

export const move = `if (!args[0] || !args[1]) {
  window.consoleprint('Must pass two paths', true);
} else {
  try {
    let one = window.FS.get(args[0]);
    let two = window.FS.get(args[1]);
    if (!Array.isArray(two)) window.consoleprint('Destination must be a folder', true);
    if (Array.isArray(one)) {
      window.consoleprint('Uhhh, moving folders unfinished :D');
    } else {
      window.FS.create(args[1]+'/'+args[0].split('/').slice(-1)[0]);
      window.FS.set(args[1]+'/'+args[0].split('/').slice(-1)[0], one);
      window.FS.delete(args[0]);
      window.consoleprint('Moved '+args[0]+' to '+args[1]);
    }
  } catch(err) {
    window.consoleprint(err, true);
  }
}`;

export const del = `if (!args[0]) {
  window.consoleprint('Must pass path', true);
} else {
  try {
    window.FS.delete(args[0]);
    window.consoleprint('deleted '+args[0]);
  } catch(err) {
    window.consoleprint(err, true);
  }
}`;