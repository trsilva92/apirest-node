select pedidos.id_pedido, pedidos.id_produto, pedidos.quantidade, 
       produtos.nome, produtos.preco
from pedidos 
inner join produtos on pedidos.id_produto = produtos.id_produto;