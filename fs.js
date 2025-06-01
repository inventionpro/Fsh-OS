import { _desktop, tty, fsh, view, js, desktop } from './builtin.js';

export class fs {
  constructor() {
    this.tree = {
      home: {
        '_desktop.json': _desktop
      },
      bin: {
        'tty.js': tty,
        'fsh.js': fsh,
        'view.js': view,
        'js.js': js,
        'dt.js': desktop
      }
    }
  }
  get(path) {
    let file = this.tree;
    let seg = path.split('/');
    switch(seg.shift()) {
      case '':
        break;
      case '~':
        if (!file.home) throw new Error('-101 Missing directory/file: home from /home');
        file = file.home;
        break;
      default:
        throw new Error('-100 Unknown fs start: '+seg[0]);
    }
    if (seg.length===1&&seg[0]==='') seg.shift();
    seg.forEach(s=>{
      if (!file[s]) throw new Error('-101 Missing directory/file: '+s+' from '+path);
      file = file[s];
    });
    if (!file) throw new Error('-101 Missing directory/file: '+seg.slice(-1)[0]+' from '+path);
    if (typeof file === 'object' && !Array.isArray(file)) {
      return Object.keys(file);
    }
    return file;
  }
}