import {
  // Critical
  fsh,
  tty,
  // Config
  _desktop,
  _permissions,
  _openers,
  // Commands
  desktop,
  js,
  clear,
  view,
  tree,
  make,
  edit,
  move,
  del
} from './builtin.js';
import { default_apps } from './apps.js';

export class fs {
  constructor() {
    this.binary_signal = Symbol('Binary');
    this.tree = {
      config: {
        'desktop.json': _desktop,
        'permissions.json': _permissions,
        'openers.json': _openers
      },
      home: {
        downloads: {},
        documents: {},
        media: {},
        video: {},
        music: {},
        'default_background.png': this.binary_signal
      },
      bin: {
        apps: default_apps,
        'tty.js': tty,
        'dt.js': desktop,

        'fsh.js': fsh,
        'js.js': js,

        'clear.js': clear,
        'tree.js': tree,

        'view.js': view,
        'make.js': make,
        'edit.js': edit,
        'move.js': move,
        'del.js': del
      }
    };
  }
  async fillBinary() {
    let replaceFiles = async(obj)=>{
      if (obj===null||typeof obj!=='object') return;
      for (let key of Object.keys(obj)) {
        if (obj[key]===this.binary_signal) {
          let file = await fetch('./media/binary/'+key);
          obj[key] = await file.blob();
        } else if (typeof obj[key]==='object') {
          await replaceFiles(obj[key]);
        }
      }
    }
    await replaceFiles(this.tree);
  }
  _nav(path, create, secondary='', content='') {
    let file = this.tree;
    let seg = path.split('/');
    switch(seg.shift()) {
      case '':
        break;
      case '@':
        if (!file.config) throw new Error('Missing directory/file: config from /config');
        file = file.config;
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
      if (typeof file[s]==='undefined') {
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
    if (typeof file==='undefined') throw new Error('Missing directory/file: '+seg.slice(-1)[0]+' from '+path);
    if (secondary==='set') {
      parent[k] = content;
      return;
    } else if (secondary==='del') {
      delete parent[k];
      return;
    }
    if (typeof file === 'object' && !Array.isArray(file) && !(file instanceof Blob)) return Object.keys(file);
    return file;
  }
  get(path) {
    return this._nav(path, false);
  }
  set(path, content) {
    this._nav(path, false, 'set', content);
  }
  create(path) {
    this._nav(path, true);
  }
  delete(path) {
    this._nav(path, false, 'del');
  }
}