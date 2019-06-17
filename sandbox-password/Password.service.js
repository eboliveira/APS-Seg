const crypto = require('crypto');
const fs = require('fs');

/*
* OBS: Não mude o valor de PATH_PASSWD com caminho direto para o
* '/etc/passwd' !!! As funções ainda estão instáveis e podem causar
* problemas para o seu computador.
*/
const PATH_PASSWD = "./passwd.log";

class ShadowModel { 
    // Link to more informations
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
        return this.toString() === other.toString();
    }
}

class PasswdModel {
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
        return this.toString() === other.toString();
    }
}


class PasswordService {
    _reloadPasswd() {
        // TODO: Alterar o "/etc/passwd" para PATH_PASSWD
        // TODO: Tratar erros de leitura de arquivo!
        // Lendo o arquivo 'passwd'
        this.passwdContent = fs.readFileSync("/etc/passwd").toString();
        
        // Armazenando os dados em uma estrutura
        this.passwords = this.passwdContent
            .split("\n")
            .map(pass => new PasswdModel(pass))
            .filter(pass => typeof pass.x !== 'undefined')
            .sort((a, b) => a.id - b.id);
    }

    _updatePasswd() {
        // Recriado o conteúdo do arquivo 'passwd' com as informações
        // contidas em memória
        this.passwdContent = this.passwords
            .map(pass => pass.toString())
            .join("\n") + "\n";
        
        // TODO: Tratar erros de escrita de arquivo!
        // Escrevendo as alterações no arquivo passwd
        fs.writeFileSync(PATH_PASSWD, this.passwdContent);
    }

    constructor() {
        this.passwdContent = "";
        this.passwdHash = "";
        this.passwords = [];

        this._reloadPasswd();
        fs.writeFileSync("./passwd.default.log", this.passwdContent);

        const ids = this.passwords
            .map(pass => pass.id)
            .filter(id => id >= 1000 && id < 10000);
        
        this.newId = Math.max(ids) + 1;
    }

    add(user, password, info = "", cmds = "/bin/bash",createDir = true) {
        // TODO: Adicionar a senha do usuário do arquivo /etc/shadow
        console.log(`Add User: ${user}\nSenha: ${password}`);
        console.log(`Id: ${this.newId}`);
        
        // Criando o modelo para o arquivo 'passwd'
        const id = this.newId;
        let home = createDir ? `/home/${user}/` : '' ;
        const userString = `${user}:x:${id}:${id}:${info}:${home}:${cmds}`;
        const userModel = new PasswdModel(userString)

        const filtered = this.passwords.filter(p => p.equals(userModel));
        if (filtered.length === 0) {
            // Criando o modelo para o arquivo 'shadow'
            const salt = "$6$" + genRandomString(8);

            // TODO: Fazer isto de forma asíncrona
            fs.writeFileSync(".pipeCrypt", `${password} ${salt}`);
            let hash = '';
            let time = 0;
            while (hash.length < 50){
                hash = fs.readFileSync(".pipeCrypt").toString();
                sleep(10);
                time += 10;
            }
            console.log(`Time: ${time}`);
            const pass = `${salt}$${hash}`;
            const date = Math.trunc(Date.now() / 3600000);
            const shadowString = `${user}:${pass}:${date}:0:99999:7:::`;
            const shadowModel = new ShadowModel(shadowString);
            
            this.newId++;
            this.passwords.push(userModel);
            this._updatePasswd();
            return true;
        }
        if (filtered.length === 1) {
            return false;
        }

        throw `Erro ao adicionar o usuário "${user}"!`
    }

    del(user) {
        // TODO: Remover a senha do usuário do arquivo /etc/shadow
        const previousLength = this.passwords.length;

        this.passwords = this.passwords
            .filter(pass => pass.user !== user);
        
        if (this.passwords.length === (previousLength - 1)) {
            // Recriado o conteúdo do arquivo 'passwd', sem o
            // usuário deletado
            this._updatePasswd();
            return true; 
        } else if (this.passwords.length === previousLength) {
            // Usuário não encontrado
            return false;
        } 

        // Se chegar aqui, aconteceu algum erro!
        throw `Erro ao deletar o usuário "${user}"!`
    }

    lock(user) {
        // Bloqueia um usuário colocar uma '!x' no atributo x na linha
        // deste usuário no arquivo 'passwd'
        let i;
        for (i = 0; i < this.passwords.length; i++) {
            if (this.passwords[i].user === user) {
                this.passwords[i].x = "!x";
                this._updatePasswd();
                break;
            }
        }

        // Retorna true se o usuário foi encontrado e bloquiado
        return i !== this.passwords.length; 
    }

    unlock(user) {
        // Desbloqueia um usuário colocar uma 'x' no atributo x na linha
        // deste usuário no arquivo 'passwd'
        let i;
        for (i = 0; i < this.passwords.length; i++) {
            if (this.passwords[i].user === user) {
                this.passwords[i].x = "x";
                this._updatePasswd();
                break;
            }
        }
        return i !== this.passwords.length; 
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
}

function sha512(password, salt) {
    /** Hashing algorithm sha512 */
    var hash = crypto.createHash('sha512', salt);
    hash.update(password);
    return hash.digest('hex').slice(0, 86);
    // return crypt(password, salt);
    // return hash;
}

module.exports = {
    PasswordService,
    PasswdModel
};