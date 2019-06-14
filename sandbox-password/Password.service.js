const CryptoJS = require("crypto-js");
var crypto = require('crypto');
const fs = require('fs');

const PATH_PASSWD = "./passwdTest";

/*
fs.readFileSync("/etc/passwd")
            .toString().split("\n").forEach(pass => {
                console.log(pass);
            });
*/

class Pass {
    constructor(pass) {
        const p = pass.split(":");
        
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
}


class PasswordService {
    _reload() {
        // TODO: Alterar o "/etc/passwd" para PATH_PASSWD
        this.passwdContent = fs.readFileSync("/etc/passwd").toString();
        
        // TODO: Tratar erros de leitura de arquivo!
        this.passwords = this.passwdContent
            .split("\n")
            .map(pass => new Pass(pass))
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
        this.passwords = [];

        this._reload();
        fs.writeFileSync("./passwd.default", this.passwdContent);

        const ids = this.passwords
            .map(pass => pass.id)
            .filter(id => id >= 1000 && id < 10000);
        
        this.newId = Math.max(ids) + 1;
    }

    add(user, password) {
        console.log(`Add User: ${user}\nSenha: ${password}`);
        console.log(`Id: ${this.newId}`);
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

module.exports = {
    PasswordService,
    Pass
};