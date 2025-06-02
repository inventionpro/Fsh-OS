import {
  // Config
  _desktop,
  // Critical
  tty,
  fsh,
  desktop,
  // Commands
  js,
  view,
  edit
} from './builtin.js';

export class fs {
  constructor() {
    this.tree = {
      home: {
        '_desktop.json': _desktop
      },
      bin: {
        'tty.js': tty,
        'fsh.js': fsh,
        'dt.js': desktop,
        'js.js': js,
        'view.js': view,
        'edit.js': edit
      }
    }
  }
  _nav(path, create) {
    let file = this.tree;
    let seg = path.split('/');
    switch(seg.shift()) {
      case '':
        break;
      case '~':
        if (!file.home) throw new Error('Missing directory/file: home from /home');
        file = file.home;
        break;
      default:
        throw new Error('Unknown fs start: '+seg[0]);
    }
    if (seg.length===1&&seg[0]==='') seg.shift();
    seg.forEach((s,i)=>{
      if (!file[s]) {
        if (create) {
          file[s] = (s.includes('.')&&seg.length-1===i)?'':{};
        } else {
          throw new Error('Missing directory/file: '+s+' from '+path);
        }
      }
      file = file[s];
    });
    if (!file) throw new Error('Missing directory/file: '+seg.slice(-1)[0]+' from '+path);
    if (typeof file === 'object' && !Array.isArray(file)) {
      return Object.keys(file);
    }
    return file;
  }
  get(path) {
    return _nav(path, false);
  }
  create(path) {
    _nav(path, true);
  }
}