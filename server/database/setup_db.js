const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/passwdpp", {
  useNewUrlParser: true
});

var passwd_pattern_schema = mongoose.model("passwd_pattern", {
  min_capital_letters: Number,
  min_tiny_letters: Number,
  min_numbers: Number,
  min_special_chars: Number,
  min_all_chars: Number,
  months_change: Number,
  user_id:String
});

var log_schema = mongoose.model('log', {
  type:String,
  dt_occurred:String,
  user_id:Number,
})


module.exports = {
  dbConnection: mongoose.connection,
  passwd_pattern_schema:passwd_pattern_schema,
  log_schema:log_schema,
};
