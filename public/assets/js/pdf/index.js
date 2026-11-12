import * as core from './core.js';
import * as merge from './merge.js';
import * as split from './split.js';
import * as edit from './edit.js';
import * as numbers from './numbers.js';
import * as images from './images.js';
import * as security from './security.js';
import * as convert from './convert.js';
import * as word from './convert-word.js';
import * as excel from './convert-excel.js';
import * as ppt from './convert-ppt.js';

// Stable namespace for the migration phase. app.js remains authoritative
// until each operation is switched over and browser behavior is audited.
window.WPDF_PDF = { core, merge, split, edit, numbers, images, security, convert, word, excel, ppt };
