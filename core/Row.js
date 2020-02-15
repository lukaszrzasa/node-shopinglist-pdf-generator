const {Url} = require("./Url");
const {EXCEL_CONFIG, STATUS_WAITING, STATUS_SKIPPED} = require('./config');
const {key_name, key_price, key_amount, key_priceTotal,
       key_url1, key_url2, key_details, key_skipped, SKIPPED_VALUE} = EXCEL_CONFIG;



// constructor definition
exports.Row = function({index, row}){
  this.row = index;
  this.status = row[key_skipped]==SKIPPED_VALUE ? STATUS_SKIPPED : STATUS_WAITING; // check if fn() should skip this row
  this.url1 = new Url({
    parent:this,
    url:row[key_url1],
    col:key_url1,
    status:this.status,
  });
  this.url2 = new Url({
    parent:this,
    url:row[key_url2],
    col:key_url2,
    status:this.status,
  });
  this.name = row[key_name];
  this.amount = row[key_amount];
  this.price = row[key_price];
  this.priceTotal = row[key_priceTotal];
  this.details = row[key_details];
};


// check if it's done
exports.Row.prototype.isDone = function() {
  if(this.status==STATUS_SKIPPED) return true;
  if(this.url1.isDone() && this.url2.isDone()) return true;
  //
  return false;
};


// check if it's done without errors
exports.Row.prototype.hasNoError = function(){
  return this.url1.hasNoError() && this.url2.hasNoError();
};