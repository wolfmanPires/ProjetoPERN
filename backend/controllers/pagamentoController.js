import pool from "../config/db.js"

//Controlador para a tabela dos pagamentos

/////////
/////GET
/////////

//receber todos os pagamentos
export const getAllPagamentos = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM pagamento");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllPagamentos do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllPagamentos do pagamentoController.js"})
    }
}

//receber um pagamento pelo id
export const getPagamento = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM pagamento WHERE id_pagamento=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getPagamento do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getPagamento do pagamentoController.js"})
    }
}

//receber pagamentos pelo id do utilizador
export const getPagamentosByUser = async (req,res) => {
    const {id_utilizador} = req.params;

    try {
        if(!id_utilizador){
            res.status(400).json({message: "id de utilizador não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM pagamento WHERE id_utilizador=$1`, [id_utilizador])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getPagamentosByUser do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getPagamentosByUser do pagamentoController.js"})
    }
}

//receber pagamentos com dados de utilizador
export const getAllPagamentosWithUtilizador = async (req,res) => {
    try{
        const RESULT = await pool.query(
            `SELECT p.id_pagamento, p.data_vencimento, p.data_pago, p.valor, p.mes_referencia, p.id_utilizador, p.is_receita, u.nome, p.tipo AS pagamento_tipo, u.tipo AS utilizador_tipo
            FROM pagamento p INNER JOIN utilizador u ON p.id_utilizador = u.id_utilizador
            ORDER BY p.data_vencimento DESC;`
        );
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllNotasWithUtilizador do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllNotasWithUtilizador do notasController.js"})
    }
}

//////////
/////POST
//////////

//criar um novo pagamento na base de dados
export const createPagamento = async (req,res) => {
    const {tipo,valor,is_receita,data_vencimento,data_pago,mes_referencia,id_utilizador} = req.body;

    try{
        if(!tipo || !valor || !data_vencimento || !id_utilizador){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO pagamento (tipo, valor, is_receita, data_vencimento, data_pago, mes_referencia, id_utilizador) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [tipo,valor,is_receita,data_vencimento,data_pago,mes_referencia,id_utilizador]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createPagamento do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createPagamento do pagamentoController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um pagamento com os dados novos pelo id
export const updatePagamento = async (req,res) => {
    const {tipo,valor,is_receita,data_vencimento,data_pago,mes_referencia,id_utilizador} = req.body;
    const {id} = req.params;

    try{
        if(!tipo || !valor || !data_vencimento || !id_utilizador || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE pagamento SET tipo=$1, valor=$2, is_receita=$3, data_vencimento=$4, data_pago=$5, mes_referencia=$6, id_utilizador=$7 WHERE id_pagamento=$8 RETURNING *", [tipo,valor,is_receita,data_vencimento,data_pago,mes_referencia,id_utilizador,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updatePagamento do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updatePagamento do pagamentoController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar um pagamento atraves do seu id
export const deletePagamento = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM pagamento WHERE id_pagamento=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deletePagamento do pagamentoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deletePagamento do pagamentoController.js"})
    }
}