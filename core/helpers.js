exports.extractHostname = function(url) {
  let hostname;
  if (url.indexOf("//") > -1) hostname = url.split('/')[2];
  else hostname = url.split('/')[0];
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
};