const bancoDeDados = require('../bancodedados/bancodedados')
const verificacoes = require('./verificacoes')

let identificador = 1

const listarContas = async (req, res) => {
    return res.json(bancoDeDados.contas)
}

const criarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try {
        const verificacao = await verificacoes.verificarDadosBody(nome, cpf, data_nascimento, telefone, email, senha)
            
            if(verificacao !== true) {
                return res.status(400).json(verificacao)
            }

            const cpfIgual = bancoDeDados
                .contas
                .find((conta) => conta.usuario.cpf === cpf)

            const emailIgual = bancoDeDados
                .contas
                .find((conta) => conta.usuario.email === email)

            if (cpfIgual || emailIgual) {
                return res.status(400).json({menssagem: 'Já existe uma conta com o cpf ou e-mail informado!'})
            }

            const conta = {
                numero: identificador++,
                saldo: 0,
                usuario: {
                    nome,
                    cpf,
                    data_nascimento,
                    telefone,
                    email,
                    senha
                }
            }

            bancoDeDados.contas.push(conta)

            return res.status(201).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
   
}

const atualizarTodoUsuario = async (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (isNaN(Number(numeroConta))) {
        res.status(400).json({menssagem: 'O numero informado não é válido.'})
    }

    try {
        const verificacao = await verificacoes.verificarDadosBody(nome, cpf, data_nascimento, telefone, email, senha)
            
        if(verificacao !== true) {
            return res.status(400).json(verificacao)
        }

        const conta = await verificacoes.acharConta(bancoDeDados, numeroConta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar uma conta com o numero da conta informado.'})
        }

        const dadosFiltro = bancoDeDados.contas.filter((conta) => conta.numero !== Number(numeroConta))

        const cpfIgual = dadosFiltro
            .find((conta) => conta.usuario.cpf === cpf)

        const emailIgual = dadosFiltro
        .find((conta) => conta.usuario.email === email)

        if (cpfIgual || emailIgual) {
            return res.status(400).json({menssagem: 'Já existe uma conta com o cpf ou e-mail informado!'})
        }

        conta.usuario.nome = nome
        conta.usuario.cpf = cpf
        conta.usuario.data_nascimento = data_nascimento
        conta.usuario.telefone = telefone
        conta.usuario.email = email
        conta.usuario.senha = senha

        return res.status(204).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const deletarConta = async (req, res) => {
    const { numeroConta } = req.params

    try {
        const conta = await verificacoes.acharConta(bancoDeDados, numeroConta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar uma conta com o numero da conta informado.'})
        }

        if (conta.saldo > 0) {
            return res.status(403).json({menssagem: 'A conta só pode ser removida se o saldo for zero!'})
        }

        const indiceConta = bancoDeDados
            .contas
            .findIndex((conta) => conta.numero === Number(numeroConta))

        bancoDeDados.contas.splice(indiceConta, 1)

        return res.status(204).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const depositar = async (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta || !valor) {
        return res.status(400).json({mensagem: 'O número da conta e o valor são obrigatórios!'})
    }

    try {
        const conta = await verificacoes.acharConta(bancoDeDados, numero_conta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar uma conta com o numero da conta informado.'})
        }

        if (isNaN(Number(valor))) {
            return res.status(400).json({menssagem: 'O valor informado não é válido'})
        }

        if (valor <= 0) {
            return res.status(400).json({menssagem: 'Deposite um valor válido, valores zerados ou negativos não são permitidos.'})
        }

        conta.saldo += Number(valor)

        const deposito = {
            data: new Date(),
            numero_conta: Number(numero_conta),
            valor
        }

        bancoDeDados.depositos.push(deposito)

        return res.status(204).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const sacar = async (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (!numero_conta) {
        return res.status(400).json({menssagem: 'O numero da conta é obrigatório!'})
    }

    if (!valor) {
        return res.status(400).json({menssagem: 'O valor a ser sacado é obrigatório!'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'Digitar a senha é obrigatório!'})
    }

    try {
        const conta = await verificacoes.acharConta(bancoDeDados, numero_conta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar uma conta com o numero da conta informado.'})
        }

        if (senha !== conta.usuario.senha) {
            return res.status(401).json({menssagem: 'A senha está incorreta.'})
        }

        if (valor < 0) {
            return res.status(400).json({menssagem: '"O valor não pode ser menor que zero!'})
        }

        if (valor > conta.saldo) {
            return res.status(200).json({menssagem: 'Saldo insuficiente para o saque!'})
        }

        conta.saldo -= valor

        const saque = {
            data: new Date(),
            numero_conta: Number(numero_conta),
            valor
        }

        bancoDeDados.saques.push(saque)

        res.status(204).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const transferir = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem) {
        return res.status(400).json({menssagem: 'O numero da conta de origem é obrigatório!'})
    }

    if (!numero_conta_destino) {
        return res.status(400).json({menssagem: 'O numero da conta de destino é obrigatório!'})
    }

    if (!valor) {
        return res.status(400).json({menssagem: 'O valor a ser sacado é obrigatório!'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'Digitar a senha é obrigatório!'})
    }

    try {
        const contaOrigem = await verificacoes.acharConta(bancoDeDados, numero_conta_origem)

        const contaDestino = await verificacoes.acharConta(bancoDeDados, numero_conta_destino)

        if (!contaOrigem) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar a conta de origem com o numero da conta informado.'})
        }

        if (!contaDestino) {
            return res.status(404).json({menssagem: 'Não foi possivel encontar a conta de destino com o numero da conta informado.'})
        }

        if (senha !== contaOrigem.usuario.senha) {
            return res.status(401).json({menssagem: 'A senha está incorreta.'})
        }

        if (valor < 0) {
            return res.status(400).json({menssagem: '"O valor não pode ser menor que zero!'})
        }

        if (valor > contaOrigem.saldo) {
            return res.status(200).json({menssagem: 'Saldo insuficiente para a trasferencia!'})
        }

        contaOrigem.saldo -= valor
        contaDestino.saldo += valor

        const transferencia = {
            data: new Date(),
            numero_conta_origem: Number(numero_conta_origem),
            numero_conta_destino: Number(numero_conta_destino),
            valor
        }

        bancoDeDados.transferencias.push(transferencia)

        return res.status(204).send()
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const verificarSaldo = async (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(400).json({menssagem: 'O numero da conta é obrigatório!'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'Digitar a senha é obrigatório!'})
    }

    try {
        const conta = await verificacoes.acharConta(bancoDeDados, numero_conta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Conta não encontrada!'})
        }

        if (senha !== conta.usuario.senha) {
            return res.status(401).json({menssagem: 'A senha está incorreta.'})
        }

        return res.json({saldo: conta.saldo})
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

const verificarExtrato = async (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(400).json({menssagem: 'O numero da conta é obrigatório!'})
    }

    if (!senha) {
        return res.status(400).json({menssagem: 'Digitar a senha é obrigatório!'})
    }

    try {
        const conta = await verificacoes.acharConta(bancoDeDados, numero_conta)

        if (!conta) {
            return res.status(404).json({menssagem: 'Conta não encontrada!'})
        }

        if (senha !== conta.usuario.senha) {
            return res.status(401).json({menssagem: 'A senha está incorreta.'})
        }

        const depositos = bancoDeDados
            .depositos
            .filter((deposito) => deposito.numero_conta === Number(numero_conta))

        const saques = bancoDeDados
            .saques
            .filter((saque) => saque.numero_conta === Number(numero_conta))

        const transferenciasEnviadas = bancoDeDados
            .transferencias
            .filter((transferencia) => transferencia.numero_conta_origem === Number(numero_conta))

            const transferenciasRecebidas = bancoDeDados
            .transferencias
            .filter((transferencia) => transferencia.numero_conta_destino === Number(numero_conta))

        const extrato = {
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas
        }

        return res.json(extrato)
    } catch (erro) {
        return res.status(500).json({erro: erro.message})
    }
}

module.exports = {
    listarContas,
    criarConta,
    atualizarTodoUsuario,
    deletarConta,
    depositar,
    sacar,
    transferir,
    verificarSaldo,
    verificarExtrato
}