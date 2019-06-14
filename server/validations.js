const { dbConnection } = require("./database/setup_db");

module.exports = {
  config_minimun_pattern_passwd: function(informations) {
    console.log(dbConnection.modelNames());
  }
};
