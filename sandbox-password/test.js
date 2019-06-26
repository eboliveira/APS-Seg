const { 
    PasswordService,
    ShadowModel,
    PasswdModel,
    deleteFolderRecursive
} = require("./Password.service.js");
const assert = require("assert");
const fs = require('fs');


describe('PasswordService', () => {
    service = new PasswordService();
    initialLengthPasswd = service.managerPasswd.objects.length;
    initialLengthShadow = service.managerShadow.objects.length;

    describe('Testes em usuários inexistêntes', () => {
        it('Deletando usuários inexistêntes', () => {
            assert.equal(service.del('PaTaTi'),   false);
            assert.equal(service.del('PaTaTa'),   false);
            assert.equal(service.del('Saitama'),  false);
            assert.equal(service.del('Meliodas'), false);
        });

        it('Desbloqueando usuários inexistêntes', () => {
            assert.equal(service.unlock('PaTaTi'),   false);
            assert.equal(service.unlock('PaTaTa'),   false);
            assert.equal(service.unlock('Saitama'),  false);
            assert.equal(service.unlock('Meliodas'), false);
        });

        it('Bloqueando usuários inexistêntes', () => {
            assert.equal(service.lock('PaTaTi'),   false);
            assert.equal(service.lock('PaTaTa'),   false);
            assert.equal(service.lock('Saitama'),  false);
            assert.equal(service.lock('Meliodas'), false);
        });

        it('Adicionando usuários inexistêntes (2 palhaços)', () => {
            assert.equal(service.add('PaTaTi', "titati"), true);
            assert.equal(service.add('PaTaTa', 'tatita'), true);
        });
        it('Adicionando usuários inexistêntes (2 personagens)', () => {
            assert.equal(service.add('Saitama', 'punch'), true);
            assert.equal(service.add('Meliodas', 'dark'), true);
        });
    });

    describe('Teste da adição de usuários', () => {
        it('Length', () => {
            assert.equal(
                initialLengthPasswd + 4,
                service.managerPasswd.objects.length
            );
            assert.equal(
                initialLengthShadow + 4,
                service.managerShadow.objects.length
            );
        });

        it('Has', () => {
            let user = new PasswdModel('PaTaTi');
            assert.equal(service.managerPasswd.has(user), 1);
            user = new PasswdModel('PaTaTa');
            assert.equal(service.managerPasswd.has(user), 1);
            user = new PasswdModel('Saitama');
            assert.equal(service.managerPasswd.has(user), 1);
            user = new PasswdModel('Meliodas');
            assert.equal(service.managerPasswd.has(user), 1);
        });
    });

    describe('Teste de gets', () => {
        describe('getUsers', () => {
            it('Deve retornar todos os usuários.', () => {
                const users = service.getUsers();
                assert.notEqual(users, null);
                assert.equal(users.length, initialLengthPasswd + 4);
                
                const first = users[0];
                assert.notEqual(first, null);
            });
            
            it('Nenhum usuário pode ter campo undefined.', () => {
                const users = service.getUsers();
                users.forEach(user => {
                    Object.keys(user).forEach(attr => {
                        assert.notEqual(user[attr], null);
                    });
                });
            });
        });

        describe('getGroups', () => {
            it('Deve retornar 0 gropos para um usuário recém criado.', () => {
                const groups = service.getGroups('PaTaTi');
                assert.notEqual(groups, null);
                assert.equal(groups.length, 0);
                
                const first = groups[0];
                assert.equal(first, null);
            });

            it('Nenhum grupo pode ter campo undefined.', () => {
                const groups = service.getGroups('PaTaTi');
                groups.forEach(group => {
                    Object.keys(group).forEach(attr => {
                        assert.notEqual(group[attr], null);
                    });
                });
            });
        });

        it('getGroup. Deve retornar o grupo do usuario recém criado.', () => {
            const group = service.getGroup('PaTaTi');
            assert.notEqual(group, null);
            assert.equal(group.name, 'PaTaTi');
        })

        it('getUser. Não deve alterar a referência.', () => {
            const user = service.getUser('PaTaTi');
            assert.notEqual(user, null);
            assert.equal(user.name, 'PaTaTi');
            const id = user.id;
            user.id = 0;

            const user2 = service.getUser('PaTaTi');
            assert.notEqual(user2, null);
            assert.notEqual(user2.id, 0);
        });

        

    });

    describe('Testes em usuários existêntes', () => {
        it('Adicionando usuários existêntes', () => {
            assert.equal(service.add('PaTaTi', "..."), false);
            assert.equal(service.add('PaTaTa', '...'), false);
            assert.equal(service.add('Saitama', '..'), false);
            assert.equal(service.add('Meliodas', '.'), false);
        });

        it('Bloqueando usuários existêntes', () => {
            assert.equal(service.lock('PaTaTi'),   true);
            assert.equal(service.lock('PaTaTa'),   true);
            assert.equal(service.lock('Saitama'),  true);
            assert.equal(service.lock('Meliodas'), true);
        });

        it('Desbloqueando usuários existêntes', () => {
            assert.equal(service.unlock('PaTaTi'),   true);
            assert.equal(service.unlock('PaTaTa'),   true);
            assert.equal(service.unlock('Saitama'),  true);
            assert.equal(service.unlock('Meliodas'), true);
        });

        it('Deletando usuários inexistêntes', () => {
            assert.equal(service.del('PaTaTi'),   true);
            assert.equal(service.del('PaTaTa'),   true);
            assert.equal(service.del('Saitama'),  true);
            assert.equal(service.del('Meliodas'), true);
        });
    });

    describe("Testando características", () => {
        it('Acionando usuário e criando um diretório', () => {
            const home = "./Home/";
            let created = service.add("MamaeHawk", "verde", { home: home });
            assert.equal(created, true);
            created = fs.existsSync(home);
            assert.equal(created, true);
            if (created) {
                deleteFolderRecursive(home);
            }
        })
    });
});
