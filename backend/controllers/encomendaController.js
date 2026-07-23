import pool from "../config/db.js"

//Controlador para a tabela das encomendas da loja

/////////
/////GET
/////////

//receber todos os encomendas
export const getAllEncomendas = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from encomenda`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllEncomendas do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllEncomendas do encomendaController.js"})
    }
}

//receber encomenda pelo id
export const getEncomenda = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from encomenda WHERE id_encomenda=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getEncomenda do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getEncomenda do encomendaController.js"})
    }
}

//receber encomenda pelo id
export const getEncomendasFromUserID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from encomenda WHERE id_utilizador_compras=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getEncomendasFromUserID do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getEncomendasFromUserID do encomendaController.js"})
    }
}

//receber todas as encomendas e nomes dos seus utilizadores
export const getAllEncomendasWithUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.id_encomenda, e.estado, e.total, e.data_encomenda, e.estado_pagamento, e.data_pagamento, e.observacoes, e.id_utilizador_compras, uc.nome AS nome_cliente, uc.email AS email_cliente, uc.telemovel AS telemovel_cliente
            FROM encomenda e INNER JOIN utilizador_compras uc ON uc.id_utilizador_compras = e.id_utilizador_compras ORDER BY e.data_encomenda DESC
        `);

        return res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao obter encomendas:", err);

        return res.status(500).json({
            message: "Erro ao obter encomendas."
        });
    }
};

/////////
/////POST
/////////

//criar novo encomenda
export const createEncomenda = async (req,res) => {
    const {estado,total,data_encomenda,stripe_checkout_session_id,stripe_payment_intent_id,estado_pagamento,data_pagamento,id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO encomenda (estado, total, data_encomenda, stripe_checkout_session_id, stripe_payment_intent_id, estado_pagamento, data_pagamento, id_utilizador_compras) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,[estado,total,data_encomenda,stripe_checkout_session_id,stripe_payment_intent_id,estado_pagamento,data_pagamento,id_utilizador_compras])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createEncomenda do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createEncomenda do encomendaController.js"})
    }
}

//criar encomenda usando um carrinho existente
export const createEncomendaFromCarrinho = async (req, res) => {
    const { id_carrinho, observacoes } = req.body;

    const id_utilizador_compras = req.session?.userStore?.id_utilizador_compras;

    if (!id_utilizador_compras) {
        return res.status(401).json({
            message: "É necessário iniciar sessão."
        });
    }

    if (!id_carrinho) {
        return res.status(400).json({
            message: "Carrinho não identificado."
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        //confirma que o carrinho pertence ao utilizador autenticado e obtém os produtos diretamente da base de dados (nulificar manipulacao DOM/ataques DOM)
        const carrinhoResult = await client.query(
            `SELECT p.id_products, p.name, p.price, p.stock, cp.quantidade
                FROM carrinho_products cp INNER JOIN carrinho c ON c.id_carrinho = cp.id_carrinho
                INNER JOIN products p ON p.id_products = cp.id_products
                WHERE cp.id_carrinho = $1 AND c.id_utilizador_compras = $2 FOR UPDATE OF p`,
            [id_carrinho, id_utilizador_compras]
        );

        const produtos = carrinhoResult.rows;

        if (produtos.length === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "O carrinho está vazio."
            });
        }

        //validar stock e quantidades pedidas
        for (const produto of produtos) {
            const quantidade = Number(produto.quantidade);
            const stock = Number(produto.stock);
            if (quantidade <= 0) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message: `Quantidade inválida para ${produto.name}.`
                });
            }
            if (quantidade > stock) {
                await client.query("ROLLBACK");

                return res.status(409).json({
                    message: `Não existe stock suficiente para ${produto.name}.`
                });
            }
        }

        //calcular total usando os preços da BD
        const total = produtos.reduce(
            (acumulado, produto) =>
                acumulado +
                Number(produto.price) * Number(produto.quantidade),
            0
        );

        const totalArredondado = Number(total.toFixed(2));

        //cria encomenda
        const encomendaResult = await client.query(
            `INSERT INTO encomenda (estado, total, observacoes, estado_pagamento, id_utilizador_compras)
                VALUES ('pendente', $1, $2, 'pendente', $3) RETURNING *`,
            [totalArredondado,observacoes?.trim() || null,id_utilizador_compras]
        );

        const encomenda = encomendaResult.rows[0];

        //cria produtos associados a encomenda (guarda o preco e quantidade para caso de alteracao de precos no futuro)
        for (const produto of produtos) {
            await client.query(
                `INSERT INTO encomenda_products (id_encomenda, id_products, preco_unitario, quantidade)
                    VALUES ($1, $2, $3, $4)`,
                [encomenda.id_encomenda,produto.id_products,produto.price,produto.quantidade]
            );
        }

        /*
         * Na futura integração com Stripe, ponderar nao apagar o carrinho, para o caso do pagamento nao ter sucesso.
         * E nao esquecer de manter as chaves privadas e com a ligacao ao webhook diretamente ao host publico para resistir RATs.
        */

        //eliminar produtos associados ao carrinho
        for (const produto of produtos) {
            await client.query(`DELETE FROM carrinho_products WHERE id_carrinho=$1 RETURNING *`,[id_carrinho]);
        }

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Encomenda criada com sucesso.",
            encomenda
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Erro detetado no createEncomendaFromCarrinho do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createEncomendaFromCarrinho do encomendaController.js"})
    } finally {
        client.release();
    }
};

/////////
/////PUT
/////////

//atualizar um encomenda com os dados novos pelo id
export const updateEncomenda = async (req,res) => {
    const {id} = req.params;
    const {estado,total,data_encomenda,stripe_checkout_session_id,stripe_payment_intent_id,estado_pagamento,data_pagamento,id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE encomenda SET estado=$1, total=$2, data_encomenda=$3, stripe_checkout_session_id=$4, stripe_payment_intent_id=$5, estado_pagamento=$6, data_pagamento=$7, id_utilizador_compras=$8 WHERE id_encomenda=$9 RETURNING *`,[estado,total,data_encomenda,stripe_checkout_session_id,stripe_payment_intent_id,estado_pagamento,data_pagamento,id_utilizador_compras,id])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateEncomenda do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateEncomenda do encomendaController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um encomenda atraves do seu id
export const deleteEncomenda = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM encomenda WHERE id_encomenda=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteEncomenda do encomendaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteEncomenda do encomendaController.js"})
    }
}

