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
        width: 100vw;
        height: 100vh;
        color: white;
        font-family: Lexend, Arial, sans-serif;
        margin: 0px;
      }
    </style>
  </head>
  <body>
    <div id="path"></div>
    <div>
      <div id="folders"></div>
      <div id="main"></div>
    </div>
    <script>
      const FS = window.parent.FS;
      function traverse(path) {
        let obj = {};
        FS.get(path).filter(f=>!f.includes('.')).forEach(p=>{
          obj[p] = traverse(path+'/'+p);
        });
        return obj;
      }
      console.log(traverse(''));
    </script>
  </body>
</html>`
};

export let default_apps = {
  'files.app': $(files)
};