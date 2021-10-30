const express = require('express')
const router = express.Router()

// Retorna todos os pedidos
router.get('/', (req, res) => {
    res.status(200).send({
        mensagem: "Retornando consulta de todos os pedidos"
    })
})

// Insere um pedido
router.post('/', (req, res) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem: "Pedido criado com sucesso",
        pedidoCriado: pedido
    })
})

// Retorna os dados de um produto específico
router.get('/:id_produto', (req, res) => {
    const id = req.params.id_produto

    if (id === 'especial') {
        res.status(200).send({
            mensagem: "você descobriu o id especial",
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: "você passou um ID"
        })
    }

    res.status(200).send({
        mensagem: "usando o GET de um pedido específico",
        id: id
    })
})

// Altera um pedido
router.patch('/', (req, res) => {
    res.status(200).send({
        mensagem: "Pedido alterado com sucesso"
    })
})

// Deleta um produto
router.delete('/', (req, res) => {
    res.status(200).send({
        mensagem: "Pedido excluído com sucesso"
    })
})

module.exports = router