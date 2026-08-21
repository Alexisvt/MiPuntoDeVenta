function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === '/api' || uri.indexOf('/api/') === 0 || uri.indexOf('/_next/') === 0) {
    return request;
  }

  if (uri === '/') {
    request.uri = '/index.html';
    return request;
  }

  if (uri.indexOf('.') === -1) {
    request.uri = uri.replace(/\/$/, '') + '/index.html';
  }

  return request;
}
