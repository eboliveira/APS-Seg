

# AVISOS FIXOS
--------------
# ----- !!! ATENÇÃO !!! -----
- OBS: Não use o valor de this.filename na classe Manager !!! As funções ainda estão instáveis e podem causar problemas para o seu computador.



# 17/06/2019
------------
- Gambiara implementada. Para testar é necessário instalar o módulo 'watchdog' no 'python3.x' (^ Python 3). Testes unitários implementados.

- Use:
> npm install
> python3 deamonCrypt.py &
- Após a primeira chamada do algorito do python, não é necessário chamar ele de novo. Ele ficará rodando e background no seu terminal.
- Use novamente quando você o fechar.
- Use 'jobs' para ver se eles está rodando.
- Para fechar use 'fg' -> 'ctrl + C'.


# Para testes manuais
> sudo node teste_Password.js 

# Para testes automáticos - O arquivo de teste é o 'test.js'
> sudo mocha




# Antes de 17/06/2019
---------------------
- Para testar o arquivo teste_Password.js é necessário instalar os pacotes "crypto-js", ou remove-lo do arquivo Password.service.js, por ainda não estar sendo utilizado.

- Simplesmente rode com:
> node teste_Password.js