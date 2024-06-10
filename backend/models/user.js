const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    accountId: String,
    name: String,
    provider: String,
    email: String,
    filiacao: String,
    level: String,
    active: Boolean,
    dateCreated: String,
    dateLastAccess: String
  });

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User)



