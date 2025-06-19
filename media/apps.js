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
        color: white;
        font-family: Lexend, Arial, sans-serif;
        margin: 0px;
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
      #main {
       flex: 1;
        display: flex;
        flex-direction: column;
        border-radius: 0.5rem;
        background-color: #0008;
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
        background-color: #0008;
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
      let current = '/';
      function showTop() {
        document.getElementById('path').innerText = current;
      }
      showTop();
      function traverse(o, n) {
        return '<details><summary><button>' + n + '</button></summary>' + Object.keys(o).map(p=>{
          if (!p.includes('.')) {
            return traverse(o[p], p);
          }
          return '';
        }).join('') + '</details>';
      }
      document.getElementById('folders').innerHTML = traverse(FS.tree, '/');
      function showContents() {
        document.getElementById('main').innerHTML = FS.get(current).map(f=>'<button'+(f.includes('.')?'':' onclick="current+=\`'+f+'\`;showTop();showContents();"')+'>'+f+'</button>').join('');
      }
      showContents();
    </script>
  </body>
</html>`
};

export let default_apps = {
  'files.app': $(files)
};