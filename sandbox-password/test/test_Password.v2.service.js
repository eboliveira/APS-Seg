const { 
    PasswordService,
    PasswdModel,
    ShadowModel,
    GroupModel
} = require("../Password.v2.service.js");
const assert = require("assert");

describe("PasswordService v2", () => {
    service = new PasswordService();
    initialUsers = service.getUsers();
    initialGroups = service.getGroups();
    initialLengthPasswd = initialUsers.length;
    initialLengthGroup = initialGroups.length;

    describe("Testes em usuários inexistêntes", () => {
        it("Deletando usuários", () => {
            assert.equal(service.removeUser("PaTaTi"),   false);
            assert.equal(service.removeUser("PaTaTa"),   false);
            assert.equal(service.removeUser("Saitama"),  false);
            assert.equal(service.removeUser("Meliodas"), false);
        });

        it("Desbloqueando usuários", () => {
            assert.equal(service.unlock("PaTaTi"),   false);
            assert.equal(service.unlock("PaTaTa"),   false);
            assert.equal(service.unlock("Saitama"),  false);
            assert.equal(service.unlock("Meliodas"), false);
        });

        it("Bloqueando usuários", () => {
            assert.equal(service.lock("PaTaTi"),   false);
            assert.equal(service.lock("PaTaTa"),   false);
            assert.equal(service.lock("Saitama"),  false);
            assert.equal(service.lock("Meliodas"), false);
        });

        it("Adicionando usuários (2 palhaços)", () => {
            assert.equal(service.addUser("PaTaTi", "titati"), true);
            assert.equal(service.addUser("PaTaTa", "tatita"), true);
        });
        
        it("Adicionando usuários (2 personagens)", () => {
            assert.equal(service.addUser("Saitama", "punch"), true);
            assert.equal(service.addUser("Meliodas", "dark"), true);
        });
    });

    describe("Teste após a adição de usuários", () => {
        it("Length", () => {
            assert.equal(
                initialLengthPasswd + 4,
                service.getUsers().length
            );
            assert.equal(
                initialLengthGroup + 4,
                service.getGroups().length
            );
        });

        it("getUser", () => {
            let user = service.getUser("PaTaTi");
            assert.notEqual(user, null);
            assert.equal(user.name, "PaTaTi");
            assert.equal(user.x, "x");
            assert.equal(user.id, 2001);
            assert.equal(user.gid, 2001);

            user = service.getUser("PaTaTa");
            assert.notEqual(user, null);
            assert.equal(user.name, "PaTaTa");
            assert.equal(user.x, "x");
            assert.equal(user.id, 2002);
            assert.equal(user.gid, 2002);

            user = service.getUser("Saitama");
            assert.notEqual(user, null);
            assert.equal(user.name, "Saitama");
            assert.equal(user.x, "x");
            assert.equal(user.id, 2003);
            assert.equal(user.gid, 2003);

            user = service.getUser("Meliodas");
            assert.notEqual(user, null);
            assert.equal(user.name, "Meliodas");
            assert.equal(user.x, "x");
            assert.equal(user.id, 2004);
            assert.equal(user.gid, 2004);
        });

        it("getGroup", () => {
            assert.notEqual(service.getGroup("PaTaTi"), null);
            assert.notEqual(service.getGroup("PaTaTa"), null);
            assert.notEqual(service.getGroup("Saitama"), null);
            assert.notEqual(service.getGroup("Meliodas"), null);
        });

        it("getGroupsFromUser", () => {

        });
    });

    describe("Testes em usuários existêntes", () => {
        it("Adicionando usuários", () => {
            assert.equal(service.addUser("PaTaTi", "..."), false);
            assert.equal(service.addUser("PaTaTa", "..."), false);
            assert.equal(service.addUser("Saitama", ".."), false);
            assert.equal(service.addUser("Meliodas", "."), false);
        });

        it("Bloqueando usuários", () => {
            assert.equal(service.lock("PaTaTi"),   true);
            assert.equal(service.lock("PaTaTa"),   true);
            assert.equal(service.lock("Saitama"),  true);
            assert.equal(service.lock("Meliodas"), true);
        });

        it("Desbloqueando usuários", () => {
            assert.equal(service.unlock("PaTaTi"),   true);
            assert.equal(service.unlock("PaTaTa"),   true);
            assert.equal(service.unlock("Saitama"),  true);
            assert.equal(service.unlock("Meliodas"), true);
        });
    });

    describe("Teste em grupos inexistêntes", () => {
        it("Adicionando grupos", () => {
            assert.equal(service.addGroup("Palhacos"), true);
            assert.equal(service.addGroup("Personagens"), true);
        });

        it("Adicionando usuário a um grupo inexistente", () => {
            assert.equal(service.addUserToGroup("PaTaTi", "AAAA"), false);
        });
    });

    describe("Teste em grupos existêntes", () => {
        it("Adicionando usuários a grupos", () => {
            assert.equal(service.addUserToGroup("PaTaTi", "Palhacos"), true);
            assert.equal(service.addUserToGroup("PaTaTa", "Palhacos"), true);
            assert.equal(service.addUserToGroup("Saitama", "Personagens"), true);
            assert.equal(service.addUserToGroup("Meliodas", "Personagens"), true);
        });

        it("Verificando a adição dos grupos", () => {
            assert.equal(service.getGroup("Personagens").users.length, 2);
            assert.equal(service.getGroup("Palhacos").users.length, 2);
        });

        it("Adicionando usuario inexistênte", () => {
            assert.equal(service.addUserToGroup("AAAA", "Palhacos"), false);
        });

    });

    describe("Finalizando os testes", () => {
        it("Deletando usuários e grupos", () => {
            assert.equal(service.removeUser("PaTaTi"),   true);
            assert.equal(service.removeUser("PaTaTa"),   true);
            assert.equal(service.removeUser("Saitama"),  true);
            assert.equal(service.removeUser("Meliodas"), true);
            assert.equal(service.removeGroup("Palhacos"), true);
            assert.equal(service.removeGroup("Personagens"), true);
        });
    });
});

describe("PasswdModel", () => {
    model = new PasswdModel();

    it("Valid", () => {
        const userObj = model.get("valid");
        assert.notEqual(userObj, null);

        const res = userObj.validAttrs();
        assert.equal(res.value, true);
        assert.equal(res.attrs.length, 0);
    });

    describe("Invalid", () => {
        describe('attr', () => {
            it("id", () => {
                const userObj = model.get("invalidid");
                assert.notEqual(userObj, null);
                
                const res = model.valid();
                assert.equal(res.value, false);
                assert.equal(res.attrs.includes("id"), true);
            });
            it("gid", () => {
                const userObj = model.get("invalidgid");
                assert.notEqual(userObj, null);
                
                const res = model.valid();
                assert.equal(res.value, false);
                assert.equal(res.attrs.includes("gid"), true);
            });
        });

        describe('rules', () => {
            it("non system id need to be >= 1000", () => {
                const userObj = model.get("invalididr");
                assert.notEqual(userObj, null);
                
                const res = model.valid();
                assert.equal(res.value, false);
                assert.equal(res.attrs.includes("id"), true);
            });
        });
    });
});