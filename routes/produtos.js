const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Retornando consulta de todos os produtos"
    })
})

// Insere um produto
router.post('/', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        conn.query(
            'insert into produtos (nome, preco) values (?, ?)', 
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release()

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                
                res.status(201).send({
                    mensagem: "Produto inserido com sucesso",
                    id_produto: resultado.insertId
                })
            }
        )
    })
})

// Retorna os dados de um produto específico
router.get('/:id_produto', (req, res, next) => {
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
        mensagem: "usando o GET de um produto específico",
        id: id
    })
})

// Altera um produto
router.patch('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Produto alterado com sucesso"
    })
})

// Deleta um produto
router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Produto excluído com sucesso"
    })
})

module.exports = router