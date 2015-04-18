(function(){
  var mongoose;
  mongoose = require('mongoose');
  module.exports = mongoose.model('Course', {
    id: String,
    CourseName: String,
    describe: String,
    deadline: String
  });
}).call(this);
