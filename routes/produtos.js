const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// Retorna todos os produtos
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            'SELECT * FROM produtos',
            (error, resultado, field) => {
                conn.release()

                if (error) {
                    return res.status(500).send({ mensagem: "Não foi retornado nenhum produto na consulta" })
                }
                return res.status(200).send({ response: resultado })
            })
    })
})

// Insere um produto
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release()

                if (error) {
                    return res.status(500).send({ mensagem: "Não foi retornado nenhum produto na consulta" })
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
router.get('/:id_produto', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({ error: "error" })
                }
                return res.status(200).send({ response: resultado })
            })
    })
})

// Altera um produto
router.patch('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `UPDATE produtos 
            SET nome = ?
            WHERE id_produto = ?;`,
            [req.body.nome, req.body.id_produto],
            (error, resultado, field) => {

                if (error) {
                    return res.status(500).send({ error: "deu ruim hein" })
                }
                return res.status(200).send({ mensagem: "produto alterado com sucesso" })
            })
    })
})

// Deleta um produto
router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Produto excluído com sucesso"
    })
})

module.exports = router