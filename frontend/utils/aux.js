const axios = require('axios');

const api = 'http://backend:3000/users';

// aux function to present the date in the dd/mm/yyyy hh:mm:ss format
function getCurrentFormattedDate() {
    var d = new Date(); 
    var formattedDate = ('0' + d.getDate()).slice(-2) + '/' +
                        ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
                        d.getFullYear() + ' ' +
                        ('0' + d.getHours()).slice(-2) + ':' +
                        ('0' + d.getMinutes()).slice(-2) + ':' +
                        ('0' + d.getSeconds()).slice(-2);
    return formattedDate;
  }
  
// aux function to present the date in the dd-mm-yyyy hh:mm:ss format
function getCurrentFormattedDateV2() {
  var d = new Date(); 
  var formattedDate = ('0' + d.getDate()).slice(-2) + '-' +
                      ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
                      d.getFullYear() + ' ' +
                      ('0' + d.getHours()).slice(-2) + ':' +
                      ('0' + d.getMinutes()).slice(-2) + ':' +
                      ('0' + d.getSeconds()).slice(-2);
  return formattedDate;
}

// aux function to check the user level (admin or 'normal' user)
async function checkLevel(req, res) {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const response = await axios.get(api + '/details', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.level;
    } 
    catch (error) {return false;}} 
  else { return false }
}

// aux funtion to get current user's username 
async function getUsername(req, res) {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const response = await axios.get(api + '/details', { headers: { Authorization: `Bearer ${token}` } });
      return response.data.username;
    } 
    catch (error) { return false; }} 
  else { return false; }
}

// aux function to check if current user is logged in
async function checkLogin(req, res) {
  if (req.cookies && req.cookies.token) {
    const token = req.cookies.token;
    try {
      const response = await axios.get(api + `?token=${token}`);
      if (response.data == null ) { return false; }
      return true;
    } 
    catch (error) { return false;}} 
  else { return false; }
}

module.exports = {
  getCurrentFormattedDate,
  getCurrentFormattedDateV2,
  checkLevel,
  getUsername,
  checkLogin
};