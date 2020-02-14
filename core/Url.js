const webshot = require('webshot');
const validUrl = require('valid-url');
const psl = require('psl');
const fs = require('fs');
const {STATUS_DONE,STATUS_ERROR,STATUS_PROCESSING,STATUS_WAITING} = require('./config');

exports.Url = function({parent, url, status=STATUS_WAITING, next}){
  this.parent = parent;
  this.url = url;
  this.status = status;
  this.next = next;
  this.errCode = '';
  this.errMsg = '';
};

