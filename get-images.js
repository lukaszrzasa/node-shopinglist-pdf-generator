const webshot = require('webshot');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const {extractHostname} = require("./core/helpers");
const rimraf = require("rimraf");

const {EXCEL_CONFIG, STATUS_WAITING, STATUS_SKIPPED} = require('./core/config');
const {SOURCE_FILE, key_url2} = EXCEL_CONFIG;


const excelJson = excelToJson({
  sourceFile: SOURCE_FILE,
});

// constructor definition
const Core = function(){
  this.rows = [];
};


// get next website screenshot
Core.prototype.next = function(prevObj){
  for(let i=prevObj.$parent.row+1; i<this.rowCount ; i++){ // start loop from prevObject parent index
    if(i%10==0 && prevObj.col==key_url2) console.log(`=============== =============== PROGRESS: ${i*2}/${this.rowCount*2} =============== ===============`);
    if(this.rows[i].url1.status==STATUS_WAITING){ // if first url status is "waiting"
      this.rows[i].url1.get();
      return;
    }
    if(this.rows[i].url2.status==STATUS_WAITING){ // if second url status is "waiting"
      this.rows[i].url2.get();
      return;
    }
  }
  this.end();
};


// start process
Core.prototype.begin = function(){
  const done = this.removeAllPrevImages();
  this.processExcel();
  this.rows[0].url1.get();
  this.rows[0].url2.get();
};


// create Row() && Url objects
Core.prototype.processExcel = function(){
  const {Row} = require("./core/Row");
  this.sheet = excelJson[Object.keys(excelJson)[0]];
  this.rowCount = this.sheet.length;
  console.log(`FOUND ${this.rowCount} ROWS IN "exel.xlsx"`);
  //
  for(let i=0; i<this.rowCount; i++){
    this.rows.push(new Row({
      index:i,
      row:this.sheet[i]
    }));
  }
};


// when all done check it again and create output.json file
Core.prototype.checkAllDone = function(){
  for(let i=0; i<this.rows.length; i++){
    if(!this.rows[i].isDone()) {
      return false;
    }
  }
  return true;
};


// create output.json (helper used to generate .pdf file)
Core.prototype.createOutputJSON = function(){
  let output = [];
  for(let i=0; i<this.rowCount; i++){
    output.push({
      name: this.rows[i].name,
      row: this.rows[i].row,
      amount: this.rows[i].amount,
      price: this.rows[i].price,
      priceTotal: this.rows[i].priceTotal,
      details: this.rows[i].details,
      url1: this.rows[i].url1.url,
      url2: this.rows[i].url2.url,
      img1: `${this.rows[i].url1.field()}.jpg`,
      img2: `${this.rows[i].url2.field()}.jpg`,
      hasNoError: this.rows[i].hasNoError(), // no error means only status==DONE
    });
  }
  const strOutput = JSON.stringify({output});// first element (in hierarchy) shouldn't be an array
  fs.writeFile("core/output.json", strOutput, function(err) {
    if(err)
      console.log(err);
  });
};


// log errors table
Core.prototype.logErrors = function(){
  let errors = [];
  for(let i=0; i<this.rowCount; i++) {
    if(this.rows[i].status!=STATUS_SKIPPED && !this.rows[i].hasNoError()){
      for(let url of ['url1', 'url2']){
        if(!this.rows[i][url].hasNoError()){
          errors.push({
            field: this.rows[i][url].field(),
            errCode: this.rows[i][url].errCode,
            domain: this.rows[i][url].url.length>8 ? extractHostname(this.rows[i][url].url) : '-',
          });
        }
      }
    }
  }
  if(errors.length>0){
    console.log('Some errors occurred during this process:');
    console.table(errors);
  } else
    console.log('Operation ended without errors :)')
};


//
Core.prototype.removeAllPrevImages = async function(){
  rimraf.sync("images");// there was some loop with fs.unlink() etc functionality, but async didn't work properly :(
};

// process summary
Core.prototype.end = function(){
  if(!this.finished) {
    if (this.checkAllDone()) {
      this.finished = true;
      this.createOutputJSON();
      console.log('=============== PROGRAM ENDED ===============');
      this.logErrors();
      console.log('type "node make-pdf.js" to create PDF!');
    } else {
      console.log('UNEXPECTED ERROR');
    }
  }
};

const images = new Core();
module.exports.next = images.next.bind(images);
images.begin();