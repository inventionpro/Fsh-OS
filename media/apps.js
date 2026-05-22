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
        margin: 2px;
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
      .t {
        display: flex;
        margin-bottom: 4px;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      #path {
        flex: 1;
      }
      .t button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        padding: 0px;
        background-color: #0004;
      }
      .t button:first-of-type {
        border-radius: 0.5rem 0 0 0.5rem;
      }
      .h {
        display: flex;
        height: 0px;
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
        display: flex;
        gap: 5px;
        padding: 5px;
        background-color: transparent;
      }
      #main button:hover {
        background-color: #0004;
      }
      #main input {
        color: currentColor;
        outline: none;
        padding: 2px 5px;
        border: 2px currentColor solid;
        border-radius: 0.5rem;
        background: none;
      }
    </style>
  </head>
  <body>
    <div class="t">
      <div id="path"></div>
      <button onclick="document.getElementById('upload-in').click()" aria-label="Upload"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M129 14.6569C129 11.0932 133.309 9.30857 135.828 11.8284L189.172 65.1716C191.691 67.6914 189.907 72 186.343 72H139C133.477 72 129 67.5228 129 62V14.6569Z"/><path d="M181.571 117.071C177.666 113.166 171.334 113.166 167.429 117.071L132.196 152.304C130.312 154.122 129.14 156.674 129.14 159.5C129.14 159.584 129.141 159.668 129.143 159.751C129.17 162.275 130.146 164.79 132.071 166.716L167.426 202.071C171.332 205.976 177.663 205.976 181.569 202.071C185.474 198.166 185.474 191.834 181.569 187.929L163.14 169.5H243.64C249.162 169.5 253.64 165.023 253.64 159.5C253.64 153.977 249.162 149.5 243.64 149.5H163.284L181.571 131.213C185.476 127.308 185.476 120.976 181.571 117.071Z"/><path d="M106.832 4.61035C113.459 4.61039 118.832 9.98296 118.832 16.6104V62.4785C118.832 73.1317 127.467 81.7684 138.121 81.7686H183.99C190.617 81.7688 195.99 87.1413 195.99 93.7686V142H181.731L188.133 135.577C195.216 128.472 195.217 116.951 188.134 109.846C181.052 102.74 169.568 102.74 162.485 109.846L125.825 146.626C118.742 153.732 118.742 165.252 125.825 172.357C126.381 172.915 126.965 173.429 127.571 173.899L161.778 208.218C168.814 215.277 180.224 215.277 187.26 208.218C194.296 201.158 194.297 189.713 187.26 182.653L181.625 177H195.99V232.227C195.99 242.88 187.353 251.516 176.7 251.516H24.9556C14.3026 251.515 5.66668 242.88 5.6665 232.227V23.8994C5.66673 13.2465 14.3026 4.61058 24.9556 4.61035H106.832Z"/></svg></button>
      <input id="upload-in" type="file" style="display:none">
      <button id="create" aria-label="Create"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><rect x="103" width="50" height="256" rx="25"/><rect y="103" width="256" height="50" rx="25"/></svg></button>
      <button onclick="showContents()" aria-label="Reload"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M160.236 241.536C180.129 235.168 197.909 223.745 211.908 208.518C218.625 201.212 216.364 189.929 208.136 184.379C199.908 178.828 188.847 181.182 181.674 188.042C172.532 196.784 161.472 203.401 149.278 207.304C131.337 213.047 111.985 212.583 94.3402 205.986C76.6956 199.389 61.7858 187.043 52.0133 170.938C42.2407 154.833 38.1745 135.907 40.4701 117.209C42.7657 98.5118 51.2895 81.1318 64.6676 67.8698C78.0456 54.6078 95.4991 46.2357 114.216 44.1034C132.932 41.9711 151.821 46.2022 167.84 56.115C174.987 60.5379 181.377 65.9773 186.835 72.2175L165.486 79.9878C161.003 81.6193 160.525 87.7694 164.702 90.0742L220.104 120.646C223.052 122.273 226.758 120.924 227.971 117.783L250.76 58.7516C252.478 54.3014 248.159 49.8975 243.676 51.529L222.271 59.3196C212.946 45.8251 200.886 34.2973 186.753 25.5513C163.869 11.3902 136.884 5.34598 110.147 8.39207C83.409 11.4383 58.4747 23.3976 39.3631 42.3434C20.2516 61.2892 8.07552 86.1182 4.79611 112.829C1.51674 139.54 7.32555 166.577 21.2863 189.583C35.2471 212.59 56.5471 230.228 81.7538 239.652C106.96 249.077 134.606 249.74 160.236 241.536Z"/></svg></button>
    </div>
    <div class="h">
      <div id="folders"></div>
      <div id="main"></div>
    </div>
    <script>
      const FS = window.top.FS;
      let current = '/home';

      let main = document.getElementById('main');

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
      function entryClick(f) {
        if (f.includes('.')) {
          window.top.openfile(current+'/'+f);
        } else {
          current += '/'+f;
          showTop();
          showContents();
        }
      }
      function showContents() {
        main.innerHTML = FS.get(current)
          .toSorted((a,b)=>b.includes('.')^a.includes('.')?a.includes('.')-b.includes('.'):a.localeCompare(b))
          .map(f=>\`<button onclick="entryClick('\${f}')">\${f.includes('.')?'':'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M0 39C0 27.9543 8.95431 19 20 19H98.4851C103.925 19 109.131 21.2163 112.902 25.1378L126.098 38.8622C129.869 42.7837 135.075 45 140.515 45H236C247.046 45 256 53.9543 256 65V217C256 228.046 247.046 237 236 237H20C8.95431 237 0 228.046 0 217V39Z"/></svg> '}\${f}</button>\`)
          .join('');
      }
      showContents();

      function showCreateInput(val) {
        main.insertAdjacentHTML('afterbegin', '<input>');
        let input = main.querySelector('input');
        input.value = val?.name??'newfile.txt';
        input.focus();
        input.setSelectionRange(0, input.value.indexOf('.'));
        let createFile = async()=>{
          let path = current+'/'+input.value;
          FS.create(path);
          if (val&&path.includes('.')) {
            window.top.hgj = val;
            let con;
            if (val.type.startsWith('text/')) {
              con = await val.text();
            } else {
              con = await val.arrayBuffer();
              con = new Blob([con], { type: val.type });
            }
            FS.set(path, con);
          }
          showContents();
        };
        input.onkeyup = (evt)=>{
          if (evt.key==='Enter') createFile();
        };
        input.onblur = createFile;
      }
      document.getElementById('create').onclick = ()=>{
        showCreateInput();
      };
      document.getElementById('upload-in').onchange = (evt)=>{
        let file = evt.target.files[0];
        evt.target.value = '';
        if (!file) return;
        showCreateInput(file);
      };
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
        overflow-y: auto;
      }
      button {
        width: 100%;
        border-radius: 0.3rem;
        background-color: #0000;
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
        <label>Rows <input type="number" id="rows" min="1" max="80"></label>
        <label>Columns <input type="number" id="cols" min="1" max="80"></label>
        <br>
        <label>Background <select id="bg-type">
          <option value="color">Color</option>
          <option value="url">URL</option>
          <option value="file">File</option>
        </select><br><input type="color" id="bg-val"></label>
        <br>
        <label>Time: <input id="time"></label>
        <details>
          <summary class="small">Time syntax</summary>
          <pre style="margin:0">%k:%M             14:04
%l:%M:%S %p       2:04:21 PM
%k:%M:%S %d/%m/%Y 14:04:21 02/06/2026
%I:%M%P %d/%m/%y  02:04pm 02/06/26

Syntax Example Description
%k       5     24 Hour
%H      05     24 Hour (2-digit)
%l       2     12 Hour
%I      02     12 Hour (2-digit)
%p      PM     AM/PM
%P      pm     am/pm
%M      04     Minute (2-digit)
%-M      4     Minute
%S      07     Second (2-digit)
%-S      7     Second
%d      02     Day (2-digit)
%-d      2     Day
%m      06     Month (2-digit)
%-m      6     Month
%Y      2026   Year (Full)
%y      26     Year (2-digit)</pre>
        </details>
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
      type.value = data.background.type;
      val.setAttribute('type', type.value==='color'?'color':'text');
      val.value = data.background.value;
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
        val.setAttribute('type', type.value==='color'?'color':'text');
      };
      val.onchange = val.oninput = ()=>{
        data.background.type = type.value;
        data.background.value = val.value;
        update();
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