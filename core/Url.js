const webshot = require('webshot'); // to take screenshot of website
const validUrl = require('valid-url'); // to valid url
const psl = require('psl'); // to quick get domain from url
const {extractHostname} = require('./helpers');
const { STATUS_DONE, STATUS_ERROR, STATUS_PROCESSING, STATUS_WAITING, STATUS_SKIPPED,
  ERR_CODE_URL_NOT_SUPPORTED, ERR_CODE_CONNECTION_TIMEOUT, ERR_CODE_INVALID_URL, ERR_CODE_UNKNOWN,
  DOMAIN_BLACKLIST, CONNECTION_TIMEOUT, WEBSHOT_CONFIG} = require('./config');
let {next} = require('../get-images');



// constructor definition
exports.Url = function({parent, url, col, status=STATUS_WAITING}){
  this.$parent = parent;
  this.url = url;
  this.col = col;
  this.status = status;
  this.errCode = null;
};


// if error || conn.timeout leave some error
exports.Url.prototype.error = function(status, errCode){
  this.status = status; // update status
  this.errCode = errCode;
  console.log(`[ERROR] ${errCode} (${this.field()}) => "${this.url}"`);
  next(this); // because we want access to this.$parent.row, etc.
};


// connection timeout handler
exports.Url.prototype.check = function(){
  if(this.status==STATUS_PROCESSING)
    this.error(STATUS_ERROR,ERR_CODE_CONNECTION_TIMEOUT);
  if(this.status==STATUS_DONE)
    next(this);
  // everything it's ok :)
};


// test if url is valid
exports.Url.prototype.test = function(){
  // check if it's web url
  if(!validUrl.isWebUri(this.url) || extractHostname(this.url)==undefined){
    this.error(STATUS_ERROR, ERR_CODE_INVALID_URL);
    return false;
  }
  // check if domain is on the blacklist
  if(DOMAIN_BLACKLIST.indexOf(psl.get(extractHostname(this.url))) != -1){
    this.error(STATUS_ERROR, ERR_CODE_URL_NOT_SUPPORTED);
    return false;
  }
  return true; // everything is ok :)
};


//get screenshot
exports.Url.prototype.get = function(){
  // if element has status == skipped (based on excel) just call next element
  if(this.status==STATUS_SKIPPED) {
    next(this);
    return;
  }
  // if element has status == waiting just get webshot :)
  if(this.status==STATUS_WAITING){
    if(this.test()){// test if url is valid
      this.status = STATUS_PROCESSING;
      setTimeout(this.check.bind(this), CONNECTION_TIMEOUT);
      webshot(this.url,`./images/${this.field()}.jpg`, WEBSHOT_CONFIG, function(err){ // take screenShot :)
        if(err){
          this.error(STATUS_ERROR, ERR_CODE_UNKNOWN); // unknown error :(
        } else {
          console.log(`[DONE] (${this.field()}) => "${this.url}"`);// everything it's OK
          this.status = STATUS_DONE;
        }
      }.bind(this));
    }
  }
};


// check if it's done
exports.Url.prototype.isDone = function(){
  return [STATUS_WAITING, STATUS_PROCESSING].indexOf(this.status)==-1;
};

// check if it's done without errors
exports.Url.prototype.hasNoError = function(){
  return !(this.isDone() && this.status!=STATUS_DONE);
};


// helper to get e.g. 3A, 5F etc.
exports.Url.prototype.field = function(){
  return `${this.$parent.row}${this.col}`;
};