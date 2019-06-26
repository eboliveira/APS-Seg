const db = require("./../setup_db");

function insert(pattern) {
  var pattern_isntance = new db.passwd_pattern_schema({
    min_capital_letters: pattern.min_capital_letters,
    min_tiny_letters: pattern.min_tiny_letters,
    min_numbers: pattern.min_numbers,
    min_special_chars: pattern.min_special_chars,
    min_all_chars: pattern.min_all_chars,
    months_change: pattern.months_change,
    user_id:pattern.user_id
  });
  pattern_isntance.save((err, res) =>{
      if (err) return console.error(err)
      console.log(res)
    })
}

function get(){
  return new Promise((resolve, reject) =>{
    db.passwd_pattern_schema.find( (err, res) =>{
        if (err) reject(err)
        resolve(res)
    })
  })
}

function getByUserId(user_id){
  return new Promise((resolve,reject) =>{
    db.passwd_pattern_schema.findOne({user_id:user_id}, (err, res) =>{
      if(err) reject(err)
      resolve(res)
    })
  })

}

module.exports = {
  insert,
  get,
  getByUserId
};
