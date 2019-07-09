const passwd_pattern_controller = require('./database/controllers/passwd_pattern')

function check_mininum_passwd(user_id, passwd) {
  passwd_pattern_controller.getByUserId(user_id).then((res) =>{
    
  })
}


module.exports = {
  check_mininum_passwd
};
