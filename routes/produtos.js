const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// Retorna todos os produtos
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `SELECT * FROM produtos`,
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            })
    })
})


// Retorna os dados de um produto específico
router.get('/:id_produto', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `SELECT * FROM produtos WHERE id_produto = ?;`,
            [req.params.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com este id"
                    })
                }
                const response = {
                    mensagem: "Produto consultado com sucesso",
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto pelo id',
                            url: 'http://localhost:3000/' + req.params.id_produto
                        }
                    }
                }
                return res.status(200).send(response)
            })
    })
})

// Insere um produto
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `INSERT INTO produtos (nome, preco) VALUES (?, ?)`,
            [req.body.nome, req.body.preco],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://logcalhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )
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
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                const response = {
                    mensagem: "Produto atualizado com sucesso",
                    produto: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera um produto',
                            url: 'http://localhost:3000/'
                        }
                    }
                }
                return res.status(202).send(response)
            })
    })
})

// Deleta um produto
router.delete('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `DELETE FROM produtos where id_produto = ?;`,
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                const response = {
                    mensagem: "Produto excluído com sucesso",
                    produto: {
                        id_produto: req.body.id_produto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http:localhost:3000/produtos',
                            body:{
                                nome: 'String',
                                preco: 'Number'
                            }
                        } 
                    }
                }
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router