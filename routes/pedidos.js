const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool;

// Retorna todos os pedidos
router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: "error" }) }

        conn.query(`SELECT pedidos.id_pedido, 
                        pedidos.id_produto, 
                        pedidos.quantidade, 
                        produtos.nome, 
                        produtos.preco
                    FROM pedidos 
                    INNER JOIN produtos 
                    ON pedidos.id_produto = produtos.id_produto;`,
            (error, result) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            "id_pedido": pedido.id_pedido,
                            "quantidade": pedido.quantidade,
                            produto: {
                                "id_produto": pedido.id_produto,
                                "nome": pedido.nome,
                                "preco": pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido específico',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})

// Retorna os dados de um pedido específico
router.get('/:id_pedido', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `SELECT * FROM pedidos WHERE id_pedido = ?;`,
            [req.params.id_pedido],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado pedido com este id"
                    })
                }
                const response = {
                    mensagem: "Pedido consultado com sucesso",
                    produto: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um pedido pelo id',
                            url: 'http://localhost:3000/' + req.params.id_pedido
                        }
                    }
                }
                return res.status(200).send(response)
            })
    })
})

// Insere um pedido
router.post('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query('SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) => {

                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Produto não encontrado"
                    })
                }

                conn.query(
                    `INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)`,
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, fields) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: "error ao inserir pedido no banco de dados" }) }
                        const response = {
                            mensagem: "Pedido inserido com sucesso",
                            produtoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os pedidos',
                                    url: 'http://logcalhost:3000/pedidos'
                                }
                            }
                        }
                        return res.status(201).send(response)
                    }
                )
            })
    })
})

// Altera um pedido
router.patch('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `UPDATE pedidos 
            SET quantidade = ?
            WHERE id_produto = ?;`,
            [req.body.nome, req.body.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                const response = {
                    mensagem: "Pedido atualizado com sucesso",
                    produto: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera um pedido',
                            url: 'http://localhost:3000/'
                        }
                    }
                }
                return res.status(202).send(response)
            })
    })
})

// Deleta um pedido
router.delete('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: "error" }) }
        conn.query(
            `DELETE FROM pedidos where id_pedido = ?;`,
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: "error" }) }

                const response = {
                    mensagem: "Pedido excluído com sucesso",
                    produto: {
                        id_produto: req.body.id_produto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um pedido',
                            url: 'http:localhost:3000/pedidos',
                            body: {
                                id_produto: 'Number',
                                quantidade: 'Number'
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