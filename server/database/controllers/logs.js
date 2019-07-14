const db = require("./../setup_db");

function insert(log_user_id, log_type, log_dt_occurred, log_user_id_target) {
    var log_instance = new db.log_schema({
        type: log_type,
        dt_occurred: log_dt_occurred,
        user_id: log_user_id,
        user_id_target: log_user_id_target
    });
    log_instance.save((err, res) => {
        if (err) return console.error(err)
        console.log(res)
    })
}

function clean() {}

function get() {
    return new Promise((resolve, reject) => {
        db.log_schema.find((err, res) => {
            if (err) reject(err)
            resolve(res)
        }).sort({ _id: -1 }).limit(10)
    })
}

module.exports = {
    insert,
    get,
};