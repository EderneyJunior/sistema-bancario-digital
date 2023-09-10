# sistema-bancario
Este repositório é uma API REST de um sistema bancário.

## Oque é este projeto ?

É um projeto de um banco digital que tem funcionalidades como:

 - Listar as contas existentes.
 - Criar uma nova conta.
 - Atualizar os dados de usuario de uma conta.
 - Excluir uma conta.
 - Fazer depósitos.
 - Fazer saques.
 - Fazer transferencias entre contas.
 - Consultar saldo.
 - Consultar extrato.

## Dados

Os dados sao guardados em **memória**, entao se for **encerrado o servidor** tudo sera **resetado do zezo**.

## Iniciando o projeto

Após fazer o clone do repositório, utilizar o comando abaixo no terminal.

**obs: tem que estar na pasta do repositório.**
`npm install`

Assim sera baixado os pacotes necessarios para rodar o código em sua máquina.

## Estrutura do banco de dados (bancodedados.js).

``` javascript
banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
        {
          "numero": "1",
          "saldo": 0,
          "usuario": {
            "nome": "Ederney",
            "cpf": "99911122234",
            "data_nascimento": "2003-05-12",
            "telefone": "71999998888",
            "email": "ederney@gmail.com",
            "senha": "12345"
          }
        }
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
```

## Listar contas bancárias.

Voce deve utilizar metodo **GET** pra **/contas** passando como parametro **query** a senha do banco.

Esta rota te permite listar todas as contas bancárias.

## Criar conta bancária

Voce deve utilizar metodo **POST** pra **/contas** passando dos dados: **nome, cpf, data_nascimento, telefone, email, senha** no body, assim sera criado uma conta bancária.

Esta rota te permite criar uma nova conta.

### Exemplo de requisição.

``` javascript
{
    "nome": "Ederney",
    "cpf": "99911122234",
    "data_nascimento": "2003-05-12",
    "telefone": "71999998888",
    "email": "ederney@gmail.com",
    "senha": "12345"
}
```

### caso algum destes não sejam informados ou inválidos tera uma menssagem de erro.

``` javascript
{
    "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
}
```

## Atualizar usuario de uma conta bancária.

Voce deve utilizar metodo **PUT** pra **/contas/:numeroConta/usuario**,sendo **numeroConta um paramentro de rota** e passando os dados  **nome, cpf, data_nascimento, telefone, email, senha** no body, e assim sera atualizado os dados do usuario passado no **numeroContas**.

Esta rota te permite atualizar os dados de um usuario.

### Exemplo de Requisição.

``` javascript
{
    "nome": "Ederney",
    "cpf": "99911122234",
    "data_nascimento": "2003-05-12",
    "telefone": "71999998888",
    "email": "ederney@gmail.com",
    "senha": "12345"
}
```

### caso algum destes não sejam informados ou inválidos tera uma menssagem de erro.

``` javascript
{
    "mensagem": "O CPF informado já existe cadastrado!"
}
```

## Deletar uma conta bancária.

Voce deve utilizar metodo **DELETE** pra **/contas/:numeroConta**

Esta rota te permite deletar uma conta

**Requisição**

 - A requisição é o **NumeroConta** passado como parametro de rota.

**Resposta**

 - Quando der sucesso na requisição retornara um status 204 e nada no body da resposta.

 - Quando falhar sera enviado uma mensagem com o motivo do erro.

 **Exemplo de erro**

 ``` javascript
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}
 ```

## Depositar em uma conta bancária.

Voce deve utilizar metodo **POST** pra **/transacoes/depositar**

Esta rota te permite despositar dinheiro em uma conta.

**Requisição**
- no body passar um objeto com os seguintes dados:

 - numero_conta
 - valor

 **Resposta**

  - Quando der sucesso sera retornado um status 204 e nada no body.

  - Quando falhar sera enviado uma menssagem com o motivo do erro.

  ### Exemplo de Deposito.

```javascript
{
	"numero_conta": "1",
	"valor": 2500
}
```

### Exemplo de  registro de um depósito.

```javascript
{
    "data": "2023-07-12 22:35:31",
    "numero_conta": "1",
    "valor": 10000
}
```

**Exemplo de erro**

```javascript
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}
```

## Sacar de uma conta bancária.

Voce deve utilizar metodo **POST** pra **/transacoes/sacar**

**Requisição**

- No body passar um objeto com os seguintes dados:

 - numero_conta
 - valor
 - senha

  **Resposta**

  - Quando der sucesso sera retornado um status 204 e nada no body.

  - Quando falhar sera enviado uma menssagem com o motivo do erro.

### Exemplo de Saque.

```javascript
{
	"numero_conta": "1",
	"valor": 2000,
    "senha": "1234"
}
```

### Exemplo do registro de um saque.

```javascript
{
    "data": "2023-07-12 22:35:31",
    "numero_conta": "1",
    "valor": 10000
}
```

**Exemplo de erro**

``` javascript
{
    "mensagem": "O valor não pode ser menor que zero!"
}
```

## Transferencia entre contas

Voce deve utilizar metodo **POST** pra **/transacoes/transferir**

Esta rota te permite fazer transferencias entre contas.

**Requisição**

 - No body passar um objeto com os seguintes dados:

 - numero_conta_origem
 - numero_conta_destino
 - valor
 - senha

**Resposta**

  - Quando der sucesso sera retornado um status 204 e nada no body.

  - Quando falhar sera enviado uma menssagem com o motivo do erro.

### Exemplo de Transferencia.

```javascript
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 15000,
	"senha": "123456"
}
```

### Exemplo do registro de uma transferência.

```javascript
{
    "data": "2023-07-12 22:35:31",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 15000
}
```

### Exemplo de erro.

``` javascript
{
    "mensagem": "Saldo insuficiente!"
}
```

## Consultar saldo

Voce deve utilizar metodo **GET** pra **/transacoes/saldo?numero_conta=123&senha=123**

Nesta rota é possivel consultar o saldo de uma conta.

**Requisição**

 - Passar parametros de rota do tipo **query**

 - numero_conta
 - senha

**Resposta**

 - Quando der sucesso sera retornado um status 200 e o saldo da conta no body.

 - Quando falhar sera enviado uma menssagem com o motivo do erro.

### Exemplo de Resposta

**Sucesso**
``` javascript
{
    "saldo": 10000
}
```

**Erro**

``` javascript
{
    "mensagem": "Conta bancária não encontada!"
}
```

## Consultar extrato

Voce deve utilizar metodo **GET** pra **/transacoes/extrato?numero_conta=123&senha=123**

Nesta rota é possivel verificar o extrato de uma conta.

**Requisição**

 - Passar parametros de rota do tipo **query**

 - numero_conta
 - senha

 **Resposta**

 - Quando der sucesso sera retornado um status 200 e o extrato da conta no body.

 - Quando falhar sera enviado uma menssagem com o motivo do erro.

 ### Exemplo de Resposta

**Sucesso**
``` javascript
{
  "depositos": [
    {
      "data": "2023-07-25 17:30:13",
      "numero_conta": "1",
      "valor": 18000
    },
    {
      "data": "2022-09-20 20:46:06",
      "numero_conta": "1",
      "valor": 12000
    }
  ],
  "saques": [
    {
      "data": "2023-08-17 20:40:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2023-08-25 20:50:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2023-08-15 22:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2023-08-10 20:00:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

**Erro**
``` javascript
{
    "mensagem": "Conta bancária não encontada!"
}
```