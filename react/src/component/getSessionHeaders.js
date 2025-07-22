// utils/sessionHeaders.js
export function getSessionHeaders() {
  return {
    'session-id': sessionStorage.getItem('sessionID'),
    'username': sessionStorage.getItem('username'),
    'userid': sessionStorage.getItem('userId'),
    'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user'
  };
}
