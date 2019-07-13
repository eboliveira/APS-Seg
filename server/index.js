const passwd_pattern_controller = require("./database/controllers/passwd_pattern");
const logs_controller = require("./database/controllers/logs");
const validations = require("./validations");
const db = require("./database/setup_db");
const bodyParser = require("body-parser");
const moment = require('moment')
const express = require("express");


const { PasswordService } = require("./services/Password.v2.service.js");
const Utils = require("./services/Utils.js");


const app = express();
const port = 8080;

const PasswdSrv = new PasswordService();

function now() {
  return moment(new Date()).format('DD/MM/YYYY');
}

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.status(202).send("Server");
});

app.post("/pattern_passwd", (req, res) => {
  passwd_pattern_controller.insert(req.body);
  res.status(200).send("Received");
});

app.get("/pattern_passwd", (req, res) => {
  passwd_pattern_controller.getByUserId(req.body.user_id).then(resp => {
    res.status(200).send(resp);
  });
});

//criar usuário
app.post("/user", (req, res) => {
  const { username, password, user_id } = req.body;
  const res_service = PasswdSrv.addUser(username, password);
  const user = PasswdSrv.getUser(username);
 
  if (res_service && user_id != "undefined") {
    logs_controller.insert(user_id, "create user", now(), user.id);
    res.status(201).send(user);
  } else {
    res.status(400).send("Bad request");
  }
});

//alterar usuário
app.put("/user", (req, res) => {
  const { username, password, user_id, user_id_target } = req.body;

  const res_service = PasswdSrv
    .getUser(username);
  
  if (password) {
    // TODO: Validar a força da senha
    PasswdSrv.managerShadow.obj.password = 
      Utils.generateHashPassword(password);
    PasswdSrv.managerShadow.add();
  }

  create_log(user_id, 'alter user', now());

  logs_controller.insert(user_id,"alter user", now(),user_id_target);
});

//deletar usuário
app.delete("/user", (req, res) => {
  const { user_id, user_id_target, username } = req.body;
  const res_service = PasswdSrv.removeUser(username);

  if (res_service) {
    logs_controller.insert(user_id,"delete user",now(),user_id_target);
    res.status(201).send(user_id_target);
  } else {
    res.status(400).send("Bad request");
  }
});

//obter os registros de eventos
app.get("/logs", (req, res) => {
  logs_controller.get().then((resp) =>{
    res.status(200).send(resp)
  })
});

//verificar senha
app.get("/check_passwd", (req, res) => {
  
});
