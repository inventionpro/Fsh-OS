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
import { default_apps } from './apps.js';

export class fs {
  constructor() {
    this.tree = {
      home: {
        '_desktop.json': _desktop
      },
      bin: {
        apps: default_apps,
        'tty.js': tty,
        'fsh.js': fsh,
        'dt.js': desktop,
        'js.js': js,
        'view.js': view,
        'edit.js': edit
      }
    }
  }
  _nav(path, create, set=false, content='') {
    let file = this.tree;
    let seg = path.split('/');
    switch(seg.shift()) {
      case '':
        break;
      case '~':
        if (!file.home) throw new Error('Missing directory/file: home from /home');
        file = file.home;
        break;
      case '#':
        if (!file.bin) throw new Error('Missing directory/file: bin from /bin');
        file = file.bin;
        break;
      default:
        throw new Error('Unknown fs start: '+seg[0]);
    }
    if (seg.length===1&&seg[0]==='') seg.shift();
    let parent, k = null;
    seg.forEach((s,i)=>{
      if (!file[s]) {
        if (create) {
          file[s] = (s.includes('.')&&seg.length-1===i)?'':{};
        } else {
          throw new Error('Missing directory/file: '+s+' from '+path);
        }
      }
      parent = file;
      k = s;
      file = file[s];
    });
    if (!file) throw new Error('Missing directory/file: '+seg.slice(-1)[0]+' from '+path);
    if (set) {
      parent[k] = content;
      return;
    }
    if (typeof file === 'object' && !Array.isArray(file)) {
      return Object.keys(file);
    }
    return file;
  }
  get(path) {
    return this._nav(path, false);
  }
  create(path) {
    this._nav(path, true);
  }
  set(path, content) {
    this._nav(path, false, true, content);
  }
}