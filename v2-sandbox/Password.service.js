const { spawn } = require("child_process");
const crypto = require('crypto');
const fs = require('fs');


class ShadowModel { 
    // Links para mais informações
    // https://www.cyberciti.biz/faq/understanding-etcshadow-file/
    // https://www.tldp.org/LDP/lame/LAME/linux-admin-made-easy/shadow-file-formats.html
    constructor(shadowOfTheColossus) {
        const s = shadowOfTheColossus.split(":");

        this.user        = s[0];
        this.password    = s[1];
        this.lastchanged = s[2];
        this.minDays     = s[3];
        this.maxDays     = s[4];
        this.warnDays    = s[5];
        this.inactive    = s[6];
        this.expire      = s[7];
        this.reserved    = s[8];
    }

    toString() {
        return `${this.user}:${this.password}:${this.lastchanged}:` +
                `${this.minDays}:${this.maxDays}:${this.warnDays}:` +
                `${this.inactive}:${this.expire}:${this.reserved}`;
    }

    equals(other) {
        return this.user === other.user;
    }
}

class PasswdModel {
    // Links para mais informações
    // https://www.cyberciti.biz/faq/understanding-etcpasswd-file-format/
    constructor(passwd) {
        const p = passwd.split(":");
        
        this.user = p[0];
        this.x    = p[1];
        this.id   = parseInt(p[2]);
        this.gid  = parseInt(p[3]);
        this.info = p[4];
        this.home = p[5];
        this.cmds = p[6];
    }

    toString() {
        return `${this.user}:${this.x}:${this.id}:${this.gid}:` +
                `${this.info}:${this.home}:${this.cmds}`;
    }

    equals(other) {
        return this.user === other.user;
    }
}

class Manager {
    check() {
        // Verifica se o arquivo foi alterado fora da aplicação
        const hash = sha512(this.content, this.filename);
        return self.hash === hash;
    }

    reload() {
        // Lendo o conteúdo do arquivo gerenciado
        this.content = fs.readFileSync(this.filename).toString();

        // Armazenando os dados em uma estrutura
        this.objects = this.content
            .split("\n")
            .filter(line => line !== "")
            .map(line => new this.Model(line));
        
        this.hash = sha512(this.content, this.filename);
    }

    update() {
        // Recriando o arquivo com o conteúdo da memória
        this.content = this.objects
            .map(obj => obj.toString())
            .join("\n");
        fs.writeFileSync(this._filename, this.content);
    }

    constructor(filename, Model) {
        /*
        * OBS: Não use o valor de this.filename!!!
        * As funções ainda estão instáveis e podem causar
        * problemas para o seu computador.
        */
        this.filename = filename;
        this._filename = "./" + filename.replace(new RegExp("/", "g"), ".").slice(1) + ".log" ;
        console.log(this._filename);
        this.Model = Model;
        this.content = "";
        this.hash = "";
        this.objects = [];
        this.reload();
        fs.writeFileSync(this._filename + ".default", this.content);
    }

    has(Model) {
        return this.objects.filter(obj => obj.equals(Model)).length;
    }

    getIndex(Model) {
        for (let i = 0; i < this.objects.length; i++)
            if (this.objects[i].equals(Model))
                return i;
        return -1;
    }

    add(Model) {
        this.objects.push(Model);
    }

    del(Model) {
        const previousLength = this.objects.length;
        this.objects = this.objects.filter(obj => !obj.equals(Model));
        return previousLength - this.objects.length;
    }

    watch(callback) {
        fs.watchFile(this.filename, callback);
    }
}


class PasswordService {
    constructor() {
        this.managerPasswd = new Manager("/etc/passwd", PasswdModel);
        this.managerShadow = new Manager("/etc/shadow", ShadowModel);

        const ids = this.managerPasswd.objects
            .map(pass => pass.id)
            .filter(id => id >= 1000 && id < 10000);
        
        this.newId = Math.max(ids) + 1;

        this.adds = 0;
    }

    add(user, password, kargs = {}) {
        // TODO: Fazer esta função de uma forma assincrona
        /*
        * kargs: infos, cmds, createDir, home
        */
        const infos = kargs.infos ? kargs.infos : "" ;
        const home  = kargs.home  ? kargs.home  : `/home/${user}/` ;
        const cmds  = kargs.cmds  ? kargs.cmds  : `/bin/bash` ;
        const createDir = !!kargs.createDir;
        // Criando o modelo para o arquivo 'passwd'
        const id = this.newId;
        const userString = `${user}:x:${id}:${id}:${infos}:${home}:${cmds}`;
        const passwdModel = new PasswdModel(userString);

        // Verificando se este usuário já existe
        const hasUser = this.managerPasswd.has(passwdModel);
        const hasShadow = this.managerShadow.has(new ShadowModel(user));
        if (!hasUser && !hasShadow) {
            // Criando o modelo para o arquivo 'shadow'
            const salt = "$6$" + genRandomString(8);
            
            const cryptpy = spawn('python3', ['Crypto.py', password, salt]);
            setTimeout(() => {
                cryptpy.stdout.on('data', (data) => {
                    const hash = data.toString();
                    console.log(hash);
                    const date = Math.trunc(Date.now() / 3600000);
                    const shadowString = `${user}:${hash}:${date}:0:99999:7:::`;
                    const shadowModel = new ShadowModel(shadowString);
    
                    // TODO: Criar o diretório para o usuário, caso for exigido
                    this.managerPasswd.add(passwdModel);
                    this.managerShadow.add(shadowModel);
                    this.newId++;
                });
                cryptpy.stderr.on('data', (data) => {});
                cryptpy.on('close', (code) => {});
            }, 50);
            sleep(50);
        }
        return !hasUser && !hasShadow;
    }

    del(user) {
        const isExcludedP = this.managerPasswd.del(new PasswdModel(user));
        const isExcludedS = this.managerShadow.del(new ShadowModel(user));
        
        if (isExcludedP === 1 && isExcludedS == 1) {
            // Atualizando os arquivos para o usuário deletado
            this.managerPasswd.update();
            this.managerShadow.update();
            return true;
        } else if (isExcludedP === 0) {
            // Usuário não encontrado
            return false;
        } 
        // Se chegar aqui, aconteceu algum erro!
        throw `Erro ao deletar o usuário "${user}"!`
    }

    lock(user) {
        // Bloqueia um usuário negando a referência para a sua senha (!x) no
        // arquivo 'passwd'
        let i = this.managerPasswd.getIndex(new PasswdModel(user));
        if (i !== -1) {
            this.managerPasswd.objects[i].x = "!x";
            this.managerPasswd.update();
        }
        // Retorna true se o usuário foi encontrado e bloqueado
        return i !== -1;
    }

    unlock(user) {
        // Desbloqueia um usuário removendo a negação da referência de sua 
        // senha (x) arquivo 'passwd'
        let i = this.managerPasswd.getIndex(new PasswdModel(user));
        if (i !== -1) {
            this.managerPasswd.objects[i].x = "x";
            this.managerPasswd.update();
        }
        // Retorna true se o usuário foi encontrado e desbloqueado
        return i !== -1;
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
}

function sha512(password, salt) {
    /** Hashing algorithm sha512 */
    var hash = crypto.createHash('sha512', salt);
    hash.update(password);
    return hash.digest('hex').slice(0, 86);
}

module.exports = {
    PasswordService,
    PasswdModel
};