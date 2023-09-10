const validaSenha = (req, res, next)  => {
    const { senha_banco } = req.query

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({menssagem: 'A senha do banco informada é inválida!'})
    }

    next()
}

module.exports = validaSenha