const verificarDadosBody = async (nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome) {
         return { menssagem: 'O nome não foi informado!' }
    }

    if (!cpf) {
        return {menssagem: 'O CPF não foi informado!'}
    }

    if (!data_nascimento) {
        return {menssagem: 'A data de nascimento não foi informada!'}
    }

    if (!telefone) {
        return {menssagem: 'O telefone não foi informado!'}
    }

    if (!email) {
        return {menssagem: 'O E-mail não foi informado!'}
    }

    if (!senha) {
        return {menssagem: 'A senha não foi informada!'}
    }

    return true
}

const acharConta = async (bancoDeDados, numeroConta) => {
    const conta = bancoDeDados
        .contas
        .find((conta) => conta.numero === Number(numeroConta))

    return conta
}

module.exports = {
    verificarDadosBody,
    acharConta
}