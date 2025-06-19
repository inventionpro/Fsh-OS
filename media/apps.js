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
      #folders, #main {
        display: flex;
        flex-direction: column;
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
      function traverse(o, n) {
        return '<details><summary>' + n + '</summary>' + Object.keys(o).map(p=>{
          if (!p.includes('.')) {
            return traverse(o[p], p);
          }
          return '';
        }).join('') + '</details>';
      }
      document.getElementById('folders').innerHTML = traverse(FS.tree, '/');
      function showContents() {
        document.getElementById('main').innerHTML = FS.get(current).map(f=>'<button>'+f+'</button>');
      }
      showContents();
    </script>
  </body>
</html>`
};

export let default_apps = {
  'files.app': $(files)
};