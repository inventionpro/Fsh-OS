function $(o){
  return JSON.stringify(o, null, 2);
}

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
        width: 100vw;
        height: 100vh;
        color: #ddd;
        font-family: Lexend, Arial, sans-serif;
        margin: 0px;
        background-color: #0004;
      }
      .h {
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
        display: flex;
        flex-direction: column;
        border-top-left-radius: 0.5rem;
        background-color: #0004;
        overflow: hidden;
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
      const FS = window.parent.FS;
      let current = '';
      function showTop() {
        document.getElementById('path').innerText = (current.length?'':'/') + current;
      }
      showTop();
      function traverse(o, n, l) {
        let inner = Object.keys(o).map(p=>{
          if (p.includes('.')) return '';
          return traverse(o[p], p, l+'/'+p);
        }).join('');
        if (inner.length<1) return '<button onclick="current=\`' + (l.length?l:'/') + '\`;showTop();showContents();">' + n + '</button>';
        return '<details><summary><button onclick="current=\`' + (l.length?l:'/') + '\`;showTop();showContents();">' + n + '</button></summary>' + inner + '</details>';
      }
      document.getElementById('folders').innerHTML = traverse(FS.tree, '/', '');
      function showContents() {
        document.getElementById('main').innerHTML = FS.get(current).map(f=>'<button'+(f.includes('.')?'':' onclick="current+=\`/'+f+'\`;showTop();showContents();"')+'>'+f+'</button>').join('');
      }
      showContents();
    </script>
  </body>
</html>`
};

const notepad = {
  id: 'notepad',
  name: 'Notepad',
  icon: './media/app/notepad.svg',
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        margin: 0px;
        overflow: hidden;
      }
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
      }
    </style>
  </head>
  <body>
    <textarea></textarea>
    <script>
      const FS = window.parent.FS;
    </script>
  </body>
</html>`
};

export let default_apps = {
  'files.app': $(files),
  'notepad.app': $(notepad)
};