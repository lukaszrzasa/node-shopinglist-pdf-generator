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

// domain blacklist (those websites don't work :( - no webshot support)
exports.DOMAIN_BLACKLIST = [
  'leroymerlin.pl',
  'tantis.pl'
];

exports.CONNECTION_TIMEOUT = 7000; // to minimize detection of anti-bot system :)

// webshot

exports.WEBSHOT_CONFIG = {
  'screenSize': {
    'width': 1920,
    'height': 1080
  },
  'userAgent': "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0"
};