const { 
    PasswordService,
    ShadowModel,
    PasswdModel
} = require("./Password.service.js");
const assert = require("assert");



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
});
