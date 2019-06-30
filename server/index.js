const passwd_pattern_controller = require('./database/controllers/passwd_pattern')
const validations = require('./validations')
const db = require('./database/setup_db')
const bodyParser = require('body-parser')
let express = require('express')

let app = express()
let port = 8080


app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})


app.get('/', (req, res) =>{
    res.status(202).send("Ola")
})

app.post('/pattern_passwd', (req, res) =>{
    passwd_pattern_controller.insert(req.body)
    res.status(200).send('Received')
})

app.get('/pattern_passwd', (req,res) =>{
    res.status(200).send(passwd_pattern_controller.get())
})

app.get('/teste', (req,res) =>{
    validations.check_mininum_passwd(req.body.user_id)
    res.status(200).send("Tested")
})