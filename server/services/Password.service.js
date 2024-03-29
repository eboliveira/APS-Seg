const b64_sha512crypt = require('sha512crypt-node');
const crypto = require('crypto');
const fs = require('fs');

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

class GroupModel {
    /**
     * Atributos:
     *
     * @param {string} name 
     *     Representa o nome do grupo.
     * @param {string} pass
     *     Representa uma referência para a senha do grupo.
     * @param {number} gid
     *     Representa o ID do grupo.
     * @param {Array<string>} users
     *     Representa a lista de usuários pertencentes a esse grupo.
     *
     * links para mais informações:
     *      https://www.cyberciti.biz/faq/understanding-etcgroup-file/
     */
    constructor(group) {
        const g = group.split(':');

        this.name  = g[0];
        this.pass  = g[1];
        this.gid   = g[2];
        this.users = g[3] ? g[3].split(',') : [];
    }

    toString() {
        return `${this.name}:${this.pass}:${this.gid}:` +
                `${this.users.join(',')}`;
    }

    equals(other) {
        return this.name == other.name;
    }

    copy() {
        return new GroupModel(this.toString());
    }
}

class ShadowModel { 
    /**
     * Atributos:
     *
     * @param {string} name
     *      Representa o nome do usuário vinculado a senha.
     * @param {string} password
     *      Senha do usuário oculta usando sha512.
     * @param {number} lastchange
     *      Data da última mudança na senha, dada em milisegundos.
     * @param {number} minDays
     *      Tempo minima para poder fazer a primeira mudança.
     *      0: Representa que as mudanças podem ser feitas a qualquer
     *      momento.
     * @param {number} maxDays
     *      Tempo máximo para ser necessário mudar a senha.
     *      99999: Representa que o usuário não precisa alterar a senha
     *      por um longo período de tempo.
     * @param {number} warnDays
     *      Tempo para alertar o usuário da necessidade de se alterar a 
     *      senha.
     * @param {number} inactive
     *      Número de dias que a conta se tornou inativa por algum
     *      critério de tempo.
     * @param {number} expire
     *      Tempo absoluto da validade da conta.
     * @param {number} reserved
     *      Campo reservado para necessidades futuras.
     *
     * Links para mais informações:
     *      https://www.cyberciti.biz/faq/understanding-etcshadow-file/
     * https://www.tldp.org/LDP/lame/LAME/linux-admin-made-easy/shadow-file-formats.html
     */
     constructor(shadowOfTheColossus) {
        const s = shadowOfTheColossus.split(':');

        this.name        = s[0];
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
        return `${this.name}:${this.password}:${this.lastchanged}:` +
                `${this.minDays}:${this.maxDays}:${this.warnDays}:` +
                `${this.inactive}:${this.expire}:${this.reserved}`;
    }

    equals(other) {
        return this.name === other.name;
    }

    copy() {
        return new ShadowModel(this.toString());
    }
}

class PasswdModel {
    /**
     * Atributos:
     * 
     * @param {string} name
     *      Representa o nome do usuário vinculado a estas informações.
     * @param {string} x
     *      Representa um link simbólico para sua senha, indicando que
     *      uma senha criptografada foi armazenada em /etc/shadow.
     * @param {string} id
     *      ID numérico do usuário no sistema.
     * @param {string} gid
     *      ID do grupo do usuário no sistema.
     * @param {string} info
     *      Comentários sobre informações extras sobre o usuário, como
     *      nome completo, telefone, etc.
     * @param {string} home
     *      Caminho absoluto até o diretório do usuário. Se o diretório
     *      não existir, é usado o diretório raiz, /.
     * @param {string} cmds
     *      Caminho absoluto dos comandos ou shell que é permitido para
     *      o usuário.
     * 
     * Links para mais informações:
     * https://www.cyberciti.biz/faq/understanding-etcpasswd-file-format/
     */
     constructor(passwd) {
        const p = passwd.split(':');
        
        this.name = p[0];
        this.x    = p[1];
        this.id   = parseInt(p[2]);
        this.gid  = parseInt(p[3]);
        this.info = p[4];
        this.home = p[5];
        this.cmds = p[6];
    }

    toString() {
        return `${this.name}:${this.x}:${this.id}:${this.gid}:` +
                `${this.info}:${this.home}:${this.cmds}`;
    }

    equals(other) {
        return this.name === other.name;
    }

    copy() {
        return new PasswdModel(this.toString());
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
            .split('\n')
            .filter(line => line !== '')
            .map(line => new this.Model(line));
        
        this.hash = sha512(this.content, this.filename);
    }

    update() {
        // Recriando o arquivo com o conteúdo da memória
        this.content = this.objects
            .map(obj => obj.toString())
            .join('\n');
        fs.writeFileSync(this._filename, this.content);
    }

    constructor(filename, Model) {
        /*
        * OBS: Não use o valor de this.filename!!!
        * As funções ainda estão instáveis e podem causar
        * problemas para o seu computador.
        */
        this.filename = filename;
        this._filename = './' + filename.replace(new RegExp('/', 'g'), '.')
            .slice(1) + '.log' ;
        this.Model = Model;
        this.content = '';
        this.hash = '';
        this.objects = [];
        this.reload();
        fs.writeFileSync(this._filename + '.default', this.content);
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
        this.update();
    }

    del(Model) {
        const previousLength = this.objects.length;
        this.objects = this.objects.filter(obj => !obj.equals(Model));
        return previousLength - this.objects.length;
    }

    watch(callback) {
        fs.watchFile(this.filename, callback);
    }

    filter(condition) {
        return this.objects.filter(condition);
    }
}


class PasswordService {
    constructor() {
        // TODO: Tratar o arquivo /etc/group também
        this.managerPasswd = new Manager('./etc.passwd.log', PasswdModel);
        this.managerShadow = new Manager('./etc.shadow.log', ShadowModel);
        this.managerGroup  = new Manager('./etc.group.log',  GroupModel);

        const ids = this.managerPasswd.objects
            .map(pass => pass.id)
            .filter(id => id >= 1000 && id < 10000);
        
        this.newId = Math.max(ids) + 1;
    }

    // TODO: Remover kargs
    // TODO: Criar métodos específicos para possíveis alterações
    add(user, password, kargs = {}) {
        /*
        * kargs: infos, cmds, createDir, home
        */
        const createDir = kargs.createDir;
        const infos = kargs.infos ? kargs.infos : '' ;
        const home  = kargs.home  ? kargs.home  : `/home/${user}/` ;
        const cmds  = kargs.cmds  ? kargs.cmds  : `/bin/bash` ;
        // Criando o modelo para o arquivo 'passwd'
        const id = this.newId;
        const userString = `${user}:x:${id}:${id}:${infos}:${home}:${cmds}`;
        const passwdModel = new PasswdModel(userString);
        const groupString = `${user}:x:${id}:`;
        const groupModel = new GroupModel(groupString);

        // Verificando se este usuário já existe
        const hasUser = this.managerPasswd.has(passwdModel);
        if (!hasUser) {
            // Criando o modelo para o arquivo 'shadow'
            const salt = `$6$${genRandomString(8)}`;
            const code = b64_sha512crypt.sha512crypt(password, salt);
            const hash = '$' + code.split('$').slice(4).join('$');
            // TODO: Verificar se 'date' corresponde com o valor exigido
            const date = Math.trunc(Date.now() / 3600000);
            const shadowString = `${user}:${hash}:${date}:0:99999:7:::`;
            const shadowModel = new ShadowModel(shadowString);

            const hasShadow = this.managerShadow.has(shadowModel);
            if (!hasShadow) {
                if ((createDir || kargs.home) && !fs.existsSync(home)){
                    // Criando o diretório para o usuario, caso exigido
                    fs.mkdirSync(home);
                }
                this.managerPasswd.add(passwdModel);
                this.managerShadow.add(shadowModel);
                this.managerGroup.add(groupModel);
                this.newId++;
                return true;
            }
        }

        return false;
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
        throw `Erro ao deletar o usuário '${user}'!`
    }

    lock(user) {
        // Bloqueia um usuário negando a referência para a sua senha (!x) no
        // arquivo 'passwd'
        let i = this.managerPasswd.getIndex(new PasswdModel(user));
        if (i !== -1) {
            this.managerPasswd.objects[i].x = '!x';
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
            this.managerPasswd.objects[i].x = 'x';
            this.managerPasswd.update();
        }
        // Retorna true se o usuário foi encontrado e desbloqueado
        return i !== -1;
    }

    getUsers() {
        return this.managerPasswd.objects
            .map(group => group.copy());
    }
    getGroups() {
        return this.managerGroup.objects
            .map(group => group.copy());
    }

    getUser(user) {
        const i = this.managerPasswd.getIndex(new PasswdModel(user));
        return this.managerPasswd.objects[i].copy();
    }
    getGroup(group) {
        const i = this.managerGroup.getIndex(new GroupModel(group));
        return this.managerGroup.objects[i].copy(); 
    }
    
    getGroups(user) {
        return this.managerGroup.filter((group) => {
            return group.users.includes(user);
        }).map(group => group.copy());
    }
}

function genRandomString(length) {
    // Gerador de strings aleatórias.
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
}

function sha512(password, salt) {
    // Algoritimo de hash sha512.
    var hash = crypto.createHash('sha512', salt);
    hash.update(password);
    return hash.digest('hex').slice(0, 86);
}

module.exports = {
    PasswordService,
    PasswdModel,
    ShadowModel,
    GroupModel,
    deleteFolderRecursive
};