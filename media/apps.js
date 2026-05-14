function $(o){
  return JSON.stringify(o, null, 2);
}

const notepad = {
  id: 'notepad',
  name: 'Notepad',
  icon: './media/app/notepad.svg',
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        display: flex;
        flex-direction: column;
      }
      textarea {
        flex: 1;
        resize: none;
        outline: none;
      }
      body, textarea {
        font-family: Lexend, Arial;
        color: white;
        border-radius: 0.5rem;
        background: none;
      }
      span {
        font-size: 85%;
        color: #bbb;
      }
      button {
        font-family: inherit;
        color: inherit;
        margin: 2px;
        border: none;
        border-radius: 0.25rem;
        background-color: #fff4;
      }
    </style>
  </head>
  <body>
    <span>New File</span>
    <textarea></textarea>
    <div>
      <button>Save</button>
    </div>
    <script>
      const FS = window.top.FS;
      let file;
      if (window.startAttributes&&window.startAttributes.file) {
        file = window.startAttributes.file;
        document.querySelector('span').innerText = file;
        document.querySelector('textarea').value = FS.get(file);
      }
      document.querySelector('button').onclick = ()=>{
        if (!file) {
          file = prompt('File path');
          document.querySelector('span').innerText = file;
        }
        try {
          FS.get(file)
        } catch(err) {
          FS.create(file);
        }
        FS.set(file, document.querySelector('textarea').value);
      };
    </script>
  </body>
</html>`
};

const files = {
  id: 'files',
  name: 'Files',
  icon: './media/app/files.svg',
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        display: flex;
        flex-direction: column;
      }
      .h {
        height: 0px;
        display: flex;
        flex: 1;
      }
      #folders {
        display: flex;
        flex-direction: column;
        width: 20%;
      }
      :not(#folders) > details {
        padding-left: 10px;
      }
      #folders button {
        cursor: pointer;
        color: #ddd;
        border: none;
        background-color: transparent;
      }
      #main {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 0.5rem;
        background-color: #0004;
        overflow: hidden auto;
      }
      #main button {
        cursor: pointer;
        text-align: left;
        color: #ddd;
        padding: 5px;
        border: none;
        background-color: transparent;
        transition: 250ms;
      }
      #main button:hover {
        background-color: #0004;
      }
    </style>
  </head>
  <body>
    <div id="path"></div>
    <div class="h">
      <div id="folders"></div>
      <div id="main"></div>
    </div>
    <script>
      const FS = window.top.FS;
      let current = '/home';
      function showTop() {
        document.getElementById('path').innerText = (current.length?'':'/') + current;
      }
      showTop();
      function traverse(o, n, l) {
        let inner = Object.keys(o).map(p=>{
          if (p.includes('.')) return '';
          return traverse(o[p], p, l+'/'+p);
        }).join('');
        if (inner.length<1) return '<button onclick="current=\`' + (l.length?l:'') + '\`;showTop();showContents();">' + n + '</button>';
        return '<details><summary><button onclick="current=\`' + (l.length?l:'') + '\`;showTop();showContents();">' + n + '</button></summary>' + inner + '</details>';
      }
      document.getElementById('folders').innerHTML = traverse(FS.tree, '/', '');
      function viewFile(file) {
        window.top.openApp('notepad', { file });
      }
      function showContents() {
        document.getElementById('main').innerHTML = FS.get(current).map(f=>'<button onclick="'+(f.includes('.')?'viewFile(current+\`/'+f+'\`)':'current+=\`/'+f+'\`;showTop();showContents()')+'">'+f+'</button>').join('');
      }
      showContents();
    </script>
  </body>
</html>`
};

const config = {
  id: 'config',
  name: 'Configuration',
  icon: './media/app/config.svg',
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        display: flex;
      }
      side {
        width: 25dvw;
        padding: 5px;
        box-sizing: border-box;
      }
      main {
        flex: 1;
        padding: 5px;
        border-radius: 0.5rem;
        background-color: #0004;
      }
      button {
        cursor: pointer;
        text-align: start;
        color: currentColor;
        width: 100%;
        font-family: inherit;
        border: none;
        border-radius: 0.3rem;
        background-color: #0000;
        transition: background 500ms;
      }
      button:hover {
        background-color: #0006;
      }
      input, select {
        font-family: inherit;
        color: currentColor;
        border: 1px currentColor solid;
        border-radius: 0.5rem;
        background: none;
      }
      option {
        color: #ddd;
        background-color: #222;
      }
      input[type="number"] {
        width: 6ch;
      }
      input[type="file"] {
        width: 100%;
        min-width: 0px;
      }
      .small {
        font-size: 75%;
      }
    </style>
  </head>
  <body>
    <side>
      <button data-tab="style">Appearance</button>
    </side>
    <main>
      <div data-tab="style">
        <b>Desktop</b><br>
        <label>Rows <input type="number" id="rows"></label>
        <label>Columns <input type="number" id="cols"></label>
        <br>
        <span class="small">^ Requires reloading desktop</span>
        <br>
        <label>Background <select id="bg-type">
          <option value="color">Color</option>
          <option value="url">Media URL</option>
          <option value="file">Media File</option>
        </select><br><input type="color" id="bg-val"></label>
        <br>
        <label>Time: <input id="time"></label>
      </div>
    </main>
    <script>
      const FS = window.top.FS;
      let rows = document.getElementById('rows');
      let cols = document.getElementById('cols');
      let type = document.getElementById('bg-type');
      let val = document.getElementById('bg-val');
      let time = document.getElementById('time');
      let data = JSON.parse(FS.get('@/desktop.json'));
      rows.value = data.desktop.rows;
      cols.value = data.desktop.columns;
      type.value = data.background.type==='url'?(data.background.value.startsWith('data:')?'file':'url'):'color';
      val.setAttribute('type', type.value);
      if (type.value!=='file') val.value = data.background.value;
      time.value = data.time.replaceAll('\\n','\\\\n');
      let debounce;
      function update() {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(()=>{
          debounce = null;
          FS.set('@/desktop.json', JSON.stringify(data));
        }, 200);
      }
      rows.onchange = cols.onchange = ()=>{
        data.desktop.rows = rows.value;
        data.desktop.columns = cols.value;
        update();
      };
      type.onchange = ()=>{
        val.setAttribute('type', type.value);
      };
      val.onchange = val.oninput = ()=>{
        switch(type.value) {
          case 'color':
            data.background.type = 'color';
            data.background.value = val.value;
            update();
            break;
          case 'url':
            data.background.type = 'url';
            data.background.value = val.value;
            update();
            break;
          case 'file':
            data.background.type = 'url';
            let reader = new FileReader();
            reader.onload = ()=>{
              data.background.value = reader.result;
              update();
            };
            reader.readAsDataURL(val.files[0]);
            break;
        }
      };
      time.onchange = ()=>{
        data.time = time.value.replaceAll('\\\\n','\\n');
        update();
      };
    </script>
  </body>
</html>`
};

const terminal = {
  id: 'terminal',
  name: 'Terminal',
  icon: './media/app/terminal.svg',
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        background-color: #000c;
      }
      body > span {
        max-height: calc(100% - 20px);
        overflow: hidden auto;
      }
      span {
        display: flex;
        flex-direction: column;
        white-space: break-spaces;
      }
      input {
        width: 100%;
        height: 20px;
        border: none;
        outline: none;
        background: transparent;
      }
      span, input {
        font-size: 14px;
        font-family: monospace;
        color: #ddd;
        margin: 0px;
        padding: 0px;
      }
      span.err {
        color: #d66;
      }
    </style>
  </head>
  <body>
    <span></span>
    <input autocapitalize="off" name="command">
    <script>
      window.top.consoleprint=(text, error)=>{
        if(error){console.error(text)}else{console.log(text)};
        document.querySelector('span').innerHTML += '<span'+(error?' class="err">':'>')+text.toString().replaceAll('<','&lt;')+'</span>';
        document.querySelector('span').scrollTop = document.querySelector('span').scrollHeight;
      }
      window.top.consoleclear=(text)=>{
        Array.from(document.querySelectorAll('span span:not(.e)')).forEach(e=>e.remove());
      }
      let io = document.querySelector('input');
      document.body.onclick=()=>{io.focus()};
      let last = '';
      io.onkeyup=(evt)=>{
        if (evt.key === 'Enter') {
          io.value = io.value.trim();
          window.top.consoleprint('> '+io.value);
          if (io.value==='') return;
          window.top.fshrunhook(io.value);
          last = io.value;
          io.value = '';
        } else if (evt.key === 'ArrowUp') {
          if (io.value === '') io.value = last;
        }
      }
    </script>
  </body>
</html>`
};

export let default_apps = {
  'notepad.app': $(notepad),
  'files.app': $(files),
  'config.app': $(config),
  'terminal.app': $(terminal)
};