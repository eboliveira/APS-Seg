const fs = require("fs");
const { generateHashPassword } = require("./Utils");

// POJO: Interface
class Pojo {
    getPrimaryKey() {} // POJO

    fromString(line) {} // POJO
    
    toString() {} // POJO

    validAttrs() {
        const res = {
            value: true,
            attrs: []
        }
        const attrs = Object.keys(this);
        for (let i = 0; i < attrs.length; i++) {
            const value = this[attrs[i]];
            if (value == null) {
                res.value = false;
                res.attrs.push(attrs[i])
            }
            if (typeof value === "number" && isNaN(value)) {
                res.value = false;
                res.attrs.push(attrs[i]);
            }
        }
        return res;
    }
}

class GroupPojo extends Pojo {
    /**
     * Esta classe possui os seguintes atributos:
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
     * Links para mais informações:
     *      https://www.cyberciti.biz/faq/understanding-etcgroup-file/
     */
    constructor(){
        super();
    }

    fromString(string) { // Override
        /**
         * Esta função se constroi a partir de uma string separada por ":".
         */
        const g = string.split(":");
        
        this.name  = g[0];
        this.pass  = g[1];
        this.gid   = g[2];
        this.users = g[3] ? g[3].split(",") : [];
        return this;
    }

    toString() { // Override
        return `${this.name}:${this.pass}:${this.gid}:` +
                `${this.users.join(",")}`;
    }
    
    getPrimaryKey() { // Override
        return this.name;
    }
}

class ShadowPojo extends Pojo {
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
    constructor(){
        super();
    }

    fromString(shadowOfTheColossus) { // Override
        const s = shadowOfTheColossus.split(":");

        this.name       = s[0];
        this.password   = s[1];
        this.lastchange = s[2];
        this.minDays    = s[3];
        this.maxDays    = s[4];
        this.warnDays   = s[5];
        this.inactive   = s[6];
        this.expire     = s[7];
        this.reserved   = s[8];
        return this;
    }

    toString() { // Override
        return `${this.name}:${this.password}:${this.lastchange}:` +
                `${this.minDays}:${this.maxDays}:${this.warnDays}:` +
                `${this.inactive}:${this.expire}:${this.reserved}`;
    }

    getPrimaryKey() { // Override
        return this.name;
    }
}

class PasswdPojo extends Pojo {
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
    constructor(){
        super();
    }

    fromString(passwd) { // Override
        const p = passwd.split(":");
        
        this.name = p[0];
        this.x    = p[1];
        this.id   = parseInt(p[2]);
        this.gid  = parseInt(p[3]);
        this.info = p[4];
        this.home = p[5];
        this.cmds = p[6];
        return this;
    }

    toString() { // Override
        return `${this.name}:${this.x}:${this.id}:${this.gid}:` +
                `${this.info}:${this.home}:${this.cmds}`;
    }

    getPrimaryKey() { // Override
        return this.name;
    }
}

// DAO: CRUDQ
class ModelDAO {
    constructor(filename, obj) {
        this.filename = filename;
        this.obj = obj;
    }

    _save(content) { // Private
        if(this.valid().value) {
            fs.writeFileSync(this.filename, content + "\n");
            return true;
        }
        return false;
    }

    watch(callback) {
        fs.watchFile(this.filename, callback);
    }

    add() { // Create
        const list = this.list();
        list.push(this.obj);
        return this._save(list.join("\n"));
    }

    get(pk) { // Read
        const result = this.filter(obj => {
            return obj.getPrimaryKey() === pk;
        });
        if (result.length === 1) {
            this.obj = result[0];
            return this.obj;
        }
        return null;
    }

    list() { // Read
        return fs
            .readFileSync(this.filename)
            .toString()
            .split("\n")
            .filter(line => line !== "")
            .map(string => {
                return new this.obj
                    .constructor()
                    .fromString(string);
            });
    }

    filter(condition) { // Read
        return this.list().filter(condition);
    }

    update() { // Update
        const content = this.list()
            .map(obj => {
                if (obj.getPrimaryKey() === this.obj.getPrimaryKey()) {
                    return this.obj.toString();
                } else {
                    return obj.toString()
                }
            }).join("\n");
        this._save(content);
    }

    del() { // Delete
        const content = this.filter(obj => {
            return obj.getPrimaryKey() !== this.obj.getPrimaryKey();
        }).join("\n");
        this._save(content);
    }

    valid() {
        return this.obj.validAttrs();
    }
}

class GroupModel extends ModelDAO {
    constructor() {
        super("./log/etc.group.log", new GroupPojo());
    }

    addUser(user) {
        const index = this.obj.users.indexOf(user);
        if (index === -1){
            this.obj.users.push(user);
        }
    }

    removeUser(user) {
        const index = this.obj.users.indexOf(user);
        if (index !== -1){
            this.obj.users.splice(index, 1);
            this.removeUser(user);
        }
    }

    removeUserFromGroups(user) {
        const content = this.list()
            .map(group => {
                this.obj = group;
                this.removeUser(user);
                return this.obj.toString();
            }).join("\n");

        this._save(content);
    }
    
    create(user, id) {
        // "groupname:x:gid:users"
        const string = `${user}:x:${id}:`;
        return this.obj.fromString(string);
    }
}

class ShadowModel extends ModelDAO { 
    constructor() {
        super("./log/etc.shadow.log", new ShadowPojo());
    }

    create(user, password) {
        // "username:criptpass:date:mindays:maxdays:warndays:expired:reserved"
        const hash = generateHashPassword(password);
        // TODO: Verificar se "date" corresponde com o valor exigido
        const date = Math.trunc(Date.now() / 3600000);
        const shadowString = `${user}:${hash}:${date}:0:99999:7:::`;
        return this.obj.fromString(shadowString);
    }
}

class PasswdModel extends ModelDAO {
    constructor() {
        super("./log/etc.passwd.log", new PasswdPojo());
    }

    create(user, id) {
        // "username:x:id:gid:info:home:cmd"
        const defaultHome = `/home/${user}`;
        const defaultCmds = `/bin/bash`;
        const string = `${user}:x:${id}:${id}::${defaultHome}:${defaultCmds}`;
        return this.obj.fromString(string);
    }

    lock() {
        this.obj.x = "!x";
        this.update();
    }

    unlock() {
        this.obj.x = "x";
        this.update();
    }

    valid() {
        const res = this.obj.validAttrs();
        const regexPaths = /^[^\/]|[\/]$/; // Deve começar com '/' e terminar sem '/'
        if (!res.attrs.includes("id")) {
            if (this.obj.id <= 1000 || this.obj.id >= 60000) {
                res.value = false;
                res.attrs.push("id");
            }
        } 
        if (!res.attrs.includes("gid")) {
            if (this.obj.gid <= 1000 || this.obj.gid >= 60000) {
                res.value = false;
                res.attrs.push("gid");
            }
        }
        if (!res.attrs.includes("home")) {
            if (this.obj.home !== "" && regexPaths.test(this.obj.home)) {
                res.value = false;
                res.attrs.push("home");
            }
        }
        if (!res.attrs.includes("cmds")) {
            if (this.obj.cmds !== "") {
                const hasInvalidCmds = this.obj.cmds
                    .split(",")
                    .filter(cmd => regexPaths.test(cmd));
                if(hasInvalidCmds.length !== 0) {
                    res.value = false;
                    res.attrs.push("cmds");
                }
            }
        }

        return res;
    }
}

class PasswordService {
    constructor() {
        this.managerPasswd = new PasswdModel();
        this.managerShadow = new ShadowModel();
        this.managerGroup  = new GroupModel();

        var ids = this.managerPasswd.list()
            .map(pass => pass.id)
            .filter(id => id >= 1000 && id < 10000);
        
        this.userId = Math.max.apply(Math, [1000].concat(ids)) + 1;
        
        ids = this.managerGroup.list()
            .map(group => group.gid)
            .filter(id => id >= 1000 && id < 10000);

        this.groupId = Math.max.apply(Math, [1000].concat(ids)) + 1;
    }

    addUser(user, password) {
        // Verificando se "user" ja existe como usuário ou grupo
        var userObj = this.managerPasswd.get(user);
        var shadowObj = this.managerShadow.get(user);
        var groupObj = this.managerGroup.get(user);
        
        if (!userObj && !shadowObj && !groupObj) {
            try {
                var res = true;

                this.managerPasswd.create(user, this.userId);
                res = res && this.managerPasswd.add();
                this.managerShadow.create(user, password);
                res = res && this.managerShadow.add();
                this.managerGroup.create(user, this.userId);
                res = res && this.managerGroup.add();

                if (res) {
                    this.userId++;
                    return true;
                }
            } catch (e) {
                console.log(e);
            }               
            // Rollback
            this.managerPasswd.get(user);
            this.managerShadow.get(user);
            this.managerGroup.get(user);
            this.managerPasswd.del();
            this.managerShadow.del();
            this.managerGroup.del();
        }

        return false;
    }

    removeUser(user) {
        // Verificando se o usuário existe
        const userObj = this.managerPasswd.get(user);
        const shadowObj = this.managerShadow.get(user);
        const groupObj = this.managerGroup.get(user);

        if (userObj && shadowObj && groupObj) {
            this.managerPasswd.del();
            this.managerShadow.del();
            this.managerGroup.del();

            this.managerGroup.removeUserFromGroups(user);
            return true;
        }
        return false;
    }

    addGroup(group) {
        const groupObj = this.managerGroup.get(group);
        if (!groupObj) {
            this.managerGroup.create(group, this.groupId);
            if (this.managerGroup.add()) {
                this.groupId++;
                return true;
            }
        }
        return false;
    }

    removeGroup(group) {
        const groupObj = this.managerGroup.get(group);
        if (groupObj) {
            this.managerGroup.del();
            return true;
        }
        return false;
    }

    addUserToGroup(user, group) {
        const groupObj = this.managerGroup.get(group);
        const userObj = this.managerPasswd.get(user);
        if (groupObj && userObj) {
            this.managerGroup.addUser(user);
            this.managerGroup.update();
            return true;
        } 
        return false;
    }

    removeUserToGroup(group, user) {
        const groupObj = this.managerGroup.get(group);
        if (groupObj) {
            this.managerGroup.removeUser(user);
            this.managerGroup.update();
            return true;
        } 
        return false;
    }

    lock(user) {
        // Bloqueia um usuário negando a referência para a sua senha (!x) no
        // arquivo "passwd"
        const userObj = this.managerPasswd.get(user);
        if (userObj) {
            this.managerPasswd.lock();
            return true;
        }
        return false;
    }

    unlock(user) {
        // Desbloqueia um usuário removendo a negação da referência de sua 
        // senha (x) arquivo "passwd"
        const userObj = this.managerPasswd.get(user);
        if (userObj) {
            this.managerPasswd.lock();
            return true;
        }
        return false;
    }

    getUsers() {
        return this.managerPasswd.list();
    }

    getGroups() {
        return this.managerGroup.list();
    }

    getUser(user) {
        this.managerShadow.get(user);
        return this.managerPasswd.get(user);
    }
    getGroup(group) {
        return this.managerGroup.get(group); 
    }
    
    getGroupsOfUser(user) {
        return this.managerGroup.filter(group => {
            return group.users.includes(user);
        });
    }
}


module.exports = {
    PasswordService,
    PasswdModel,
    ShadowModel,
    GroupModel,
};