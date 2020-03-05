// url status
exports.STATUS_WAITING = 0;
exports.STATUS_SKIPPED = 1;
exports.STATUS_PROCESSING = 2;
exports.STATUS_ERROR = 3;
exports.STATUS_DONE = 4;

// error codes
exports.ERR_CODE_CONNECTION_TIMEOUT = 'CONNECTION TIMEOUT';
exports.ERR_CODE_INVALID_URL = 'INVALID URL';
exports.ERR_CODE_URL_NOT_SUPPORTED = 'URL IS NOT SUPPORTED'; // based on config.js file - some websites are not supported by webshot library and webshot don't give us any error
exports.ERR_CODE_UNKNOWN = 'UNKNOWN ERROR';

//if you're sure that some domain doesn't work, just add it to this array
exports.DOMAIN_BLACKLIST = [
];

exports.CONNECTION_TIMEOUT = 10000; // to minimize detection of anti-bot system :) // it should be fast to implement not recomended solution

// webshot
exports.WEBSHOT_CONFIG = {
  screenSize: {//screenshot size
    'width': 1920,
    'height': 1080
  },
  userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0",// I've just copy this from my browser
};

// excel
exports.EXCEL_CONFIG = {
  SOURCE_FILE: 'excel.xlsx',
  SKIPPED_VALUE:'SKIP',//js will search for this value (it can be 1, true, etc
  //
  key_name: 'A',//eg. A1, A2, A3, A3...
  key_amount: 'B',
  key_price: 'C',
  key_priceTotal: 'D',
  key_url1: 'E',
  key_url2: 'F',
  key_details: 'G',
  key_skipped: 'I',
};