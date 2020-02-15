var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

const fs = require('fs');
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);



// constructor definition
const Pdf = function(){
  this.doc = {
    content:[],
  }
};

Pdf.prototype.loadOutputJson = function(){
  const configStr = fs.readFileSync("./core/output.json");
  this.rows = JSON.parse(configStr).output;
};

Pdf.prototype.processRows = function(){
  for(let i=0; i<this.rows.length; i++){
    if(this.rows[i].hasNoError){
      if(this.doc.content.length>0){// because we want page break but not at beginning of pdf file
        this.doc.content.push({
          text:'',
          pageBreak: 'before',
        });
      }
      this.doc.content.push(...[
        {
          ul:[
            `Nazwa: ${this.rows[i].name}`,
            `Cena jednostkowa: ${this.rows[i].price} zł`,
            `Liczba sztuk: ${this.rows[i].amount}`,
            `Cena (łącznie): ${this.rows[i].priceTotal} zł`,
            `Link do sklepu: ${this.rows[i].url1}`
          ]
        },{
          image: `images/${this.rows[i].img1}`,
          width:450
        },{
          ul:[
            `Link do sklepu z kontrofertą: ${this.rows[i].url2}`
          ]
        },{
          image: `images/${this.rows[i].img2}`,
          width:450
        }
      ]);
    }
  }
};


//
Pdf.prototype.createPdfOutputFile = function(){
  const pdfDoc = printer.createPdfKitDocument(this.doc, {});
  pdfDoc.pipe(fs.createWriteStream('output.pdf'));
  pdfDoc.end();
};

const pdf = new Pdf();
pdf.loadOutputJson();
pdf.processRows();
pdf.createPdfOutputFile();