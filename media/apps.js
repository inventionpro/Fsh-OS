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
        background: red;
      }
    </style>
  </head>
  <body>
    <p>HH</p>
  </body>
</html>`
};

export let default_apps = {
  'files.app': $(files)
};