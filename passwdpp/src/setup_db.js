const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/passwdpp",{useNewUrlParser: true});
export var dbConnection = mongoose.connection

export function setup_models() {
  mongoose.model("passwd_pattern", {
    min_capital_letters: Number,
    min_tiny_letters: Number,
    min_numbers: Number,
    min_special_chars: Number,
    min_all_chars: Number,
    months_change: Number
  });
  mongoose.model("passwd", {
      passwd_crypt:String,
      created_date:Date,
      strength:String,
  });
}
