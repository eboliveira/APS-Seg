const passwd_pattern_controller = require('./database/controllers/passwd_pattern')

function check_mininum_passwd(user_id) {
  passwd_pattern_controller.getByUserId(user_id).then((res) =>{
    //not finished yet
    console.log(res)
  }, (error) =>{
    console.log(error)
  })
}


module.exports = {
  check_mininum_passwd
};
