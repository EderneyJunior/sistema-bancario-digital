const express = require('express')
const banco = require('./controladores/banco')
const validaSenha = require('./intermediarios')

const rotas = express()

rotas.get('/contas', validaSenha, banco.listarContas)
rotas.post('/contas', banco.criarConta)
rotas.put('/contas/:numeroConta/usuario', banco.atualizarTodoUsuario)
rotas.delete('/contas/:numeroConta', banco.deletarConta)
rotas.post('/transacoes/depositar', banco.depositar)
rotas.post('/transacoes/sacar', banco.sacar)
rotas.post('/transacoes/transferir', banco.transferir)
rotas.get('/contas/saldo', banco.verificarSaldo)
rotas.get('/contas/extrato', banco.verificarExtrato)

module.exports = rotas