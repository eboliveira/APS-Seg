const moment = require('moment')
const express = require("express")
var cors = require('cors')

const passwd_pattern_controller = require("./database/controllers/passwd_pattern")
const logs_controller = require("./database/controllers/logs")
const validations = require("./validations")
const db = require("./database/setup_db")
const bodyParser = require("body-parser")
const { PasswordService } = require("./services/Password.v2.service.js")
const Utils = require("./services/Utils.js")


const app = express()
const port = 8080

var whitelist = ['http://127.0.0.1:3000']
var corsOptions = {
    origin: function(origin, callback) {
        console.log(origin);

        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors())

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
    passwd_pattern_controller.get().then(resp => {
        res.status(200).send(resp);
    });
});


//listar 1 usuário
app.get("/user/:username", (req, res) => {
    const user = PasswdSrv.getUser(req.params.username);

    if (user) {
        res.status(200).send(JSON.stringify(user))
    } else {
        res.status(200).send(JSON.stringify({}))
    }
});

//listar usuários
app.get("/user", (req, res) => {
    const usersList = PasswdSrv.getUsers();

    if (usersList) {
        res.status(200).send(JSON.stringify(usersList))
    } else {
        res.status(500).send("Internal Server Error")
    }
});

//criar usuário
app.post("/user", (req, res) => {

    const { username, password, info, user_id } = req.body;

    const res_service = PasswdSrv.addUser(username, password, info);
    const user = PasswdSrv.getUser(username);

    if (!res_service && user) {
        res.status(400).send("User already exists");
    }

    if (res_service && user_id != "undefined") {
        logs_controller.insert(user_id, "criou", now(), user.id);
        res.status(201).send(user);
    } else {
        res.status(400).send("Bad Request");
    }

});

//alterar usuário
app.put("/user/:username", (req, res) => {
    const { x, info, password, user_id, user_id_target, home, cmds, name } = req.body;
    const username = req.params.username;

    var user = PasswdSrv.getUser(username)
    var shadow = PasswdSrv.managerShadow.get(username)
    var group = PasswdSrv.getGroup(username)

    var userAll = PasswdSrv.getUsers()
    var shadowAll = PasswdSrv.managerShadow.list()
    var groupAll = PasswdSrv.managerGroup.list()

    var indexUser = -1
    var indexShadow = -1
    var indexGroup = -1

    if (!user) {
        res.status(400).send("Bad Request");
    }

    if (x) {
        PasswdSrv.unlock()
    } else if (!x) {
        PasswdSrv.lock()
    }

    if (name != undefined) {
        user.name = name
    }
    if (home != undefined) {
        user.home = home
    }
    if (cmds != undefined) {
        user.cmds = cmds
    }
    if (info != undefined) {
        user.info = info
    }

    for (let i = 0; i < userAll.length; i++) {
        const u = userAll[i];
        if (u.name === username) {
            indexUser = i
            break
        }
    }

    if (indexUser >= 0) {
        userAll.splice(indexUser, 1, user)
    }

    if (user.name != username) {
        group.name = user.name

        for (let i = 0; i < groupAll.length; i++) {
            const u = groupAll[i];
            if (u.name === username) {
                indexGroup = i
                break
            }
        }

        if (indexGroup >= 0) {
            groupAll.splice(indexGroup, 1, group)
        }

        shadow.name = user.name
    }

    if (password != undefined) {

        // TODO: Validar a força da senha
        shadow.password =
            Utils.generateHashPassword(password);
    }

    for (let i = 0; i < shadowAll.length; i++) {
        const u = shadowAll[i];
        if (u.name === username) {
            indexShadow = i
            break
        }
    }

    if (indexShadow >= 0) {
        shadowAll.splice(indexShadow, 1, shadow)
    }

    PasswdSrv.managerPasswd._save(userAll.join("\n"))
    PasswdSrv.managerShadow._save(shadowAll.join("\n"))
    PasswdSrv.managerGroup._save(groupAll.join("\n"))

    const newUser = PasswdSrv.getUser(username)

    logs_controller.insert(user_id, "alterou", now(), user_id_target);

    res.status(200).send(newUser);
});

//deletar usuário
app.delete("/user", (req, res) => {
    const { user_id, user_id_target, username } = req.body;
    const res_service = PasswdSrv.removeUser(username);

    if (res_service) {
        logs_controller.insert(user_id, "deletou", now(), user_id_target);
        res.status(201).send(user_id_target);
    } else {
        res.status(400).send("Bad request");
    }
});

//obter os registros de eventos
app.get("/logs", (req, res) => {
    logs_controller.get().then((resp) => {
        res.status(200).send(resp)
    })
});

//verificar senha
app.get("/check_passwd", (req, res) => {

});