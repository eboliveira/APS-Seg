const db = require("./../setup_db");

function insert(log) {
  var log_instance = new db.log_schema({
    type:log.type,
    dt_occurred:log.dt_occurred,
    user_id:log.user_id,
  });
  log_instance.save((err, res) =>{
      if (err) return console.error(err)
      console.log(res)
    })
}

function create_log(user_id, type, dt_occurred){
    var log = {}
    log.user_id = user_id
    log.type = type
    log.dt_occurred = dt_occurred
    // log.user_id_affected = req.body.user_id_affected
    logs_controller.insert(log)
}

function clean(){
}

module.exports = {
  insert,
};
