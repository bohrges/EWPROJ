const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    _id: String,
    username: String,
    name: String,
    email: String,
    level: String,
    active: Boolean,
    dateCreated: String,
    dateLastAccess: String
  }, {
    versionKey: false}
);

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User, 'users')