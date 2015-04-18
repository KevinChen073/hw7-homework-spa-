(function(){
  var mongoose;
  mongoose = require('mongoose');
  module.exports = mongoose.model('User', {
    id: String,
    schoolId: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    role: String
  });
}).call(this);
