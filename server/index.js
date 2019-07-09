const passwd_pattern_controller = require("./database/controllers/passwd_pattern");
const logs_controller = require("./database/controllers/logs");
const create_log = require("./database/controllers/logs");
const validations = require("./validations");
const db = require("./database/setup_db");
const bodyParser = require("body-parser");
const moment = require('moment')
let express = require("express");

let app = express();
let port = 8080;

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
  passwd_pattern_controller.getByUserId(req.headers.user_id).then(resp => {
    res.status(200).send(resp);
  });
});

//criar usuário
app.post("/user", (req, res) => {


    create_log(req.headers.user_id, 'create user', moment(new Date()).format('DD/MM/YYYY'))
    res.status(200).send('received')
});

//alterar usuário
app.put("/user", (req, res) => {
    
    create_log(req.headers.user_id, 'alter user', moment(new Date()).format('DD/MM/YYYY'))
});

//deletar usuário
app.delete("/user", (req, res) => {
    
    create_log(req.headers.user_id, 'delete user', moment(new Date()).format('DD/MM/YYYY'))
});

//obter os registros de eventos
app.get("/logs", (req, res) => {

});

//verificar senha
app.get("/check_passwd", (req, res) => {

});
