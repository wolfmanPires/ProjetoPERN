import pool from "../config/db.js"
import argon2 from "argon2"

//Controlador para a tabela dos users da loja

/////////
/////GET
/////////

//receber todos os utilizadores da loja
export const getAllUtilizadoresCompras = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from utilizador_compras`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllUtilizadoresCompras do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllUtilizadoresCompras do utilizadorComprasController.js"})
    }
}

//receber utilizador da loja pelo id
export const getUtilizadorCompras = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from utilizador_compras WHERE id_utilizador_compras=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getUtilizadorCompras do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getUtilizadorCompras do utilizadorComprasController.js"})
    }
}

//receber utilizadores da loja e verifica se e gestor
export const getUtilizadorGestor = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT uc.*, g.id_gestor, CASE WHEN g.id_utilizador_compras IS NOT NULL THEN TRUE ELSE FALSE END AS is_gestor
                FROM utilizador_compras uc LEFT JOIN gestor g ON uc.id_utilizador_compras = g.id_utilizador_compras ORDER BY uc.nome;`)
        
        res.status(200).json(RESULT.rows)
        
    } catch (err) {
        console.error("Erro detetado no getUtilizadorGestor do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getUtilizadorGestor do utilizadorComprasController.js"})
    }
}

/////////
/////POST
/////////

//criar novo utilizador da loja
export const createUtilizadorCompras = async (req,res) => {
    const {nome,email,telemovel,password} = req.body
    const password_hash = await argon2.hash(password)

    try {
        if(!nome || !email || !telemovel || !password_hash){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO utilizador_compras (nome, email, telemovel, password_hash, email_verificado) VALUES ($1, $2, $3, $4, TRUE) RETURNING *`,[nome,email,telemovel,password_hash])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createUtilizadorCompras do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createUtilizadorCompras do utilizadorComprasController.js"})
    }
}

export const verificaPasswordStore = async (req,res) => {
    const {email,password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message: "E-mail ou palavra-passe em falta, por favor tente de novo"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM utilizador_compras WHERE email=$1`, [email])
            const user = RESULT.rows[0];
            if(!user){
                //O Email nao existe
                return res.status(401).json({message: "Dados incorretos, por favor tente de novo."})
            }else{
                //Verifica a palavra-passe
                const validPassword = await argon2.verify(
                    user.password_hash, password
                )

                //Caso password invalida, ou e uma conta nao confirmada, manda erro
                if(!validPassword || !user.email_verificado){
                    return res.status(401).json({message: "Dados incorretos, por favor tente de novo."})
                }

                //Caso correta, guarda na sessao da loja o utilizador
                req.session.userStore = {
                    id_utilizador_compras: user.id_utilizador_compras,
                    nome: user.nome,
                    email: user.email,
                    telemovel: user.telemovel
                }
                res.status(200).json({
                    user: req.session.userStore
                })
            }
        }
    } catch (err) {
        console.error("Erro detetado no verificaPasswordStore do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no verificaPasswordStore do utilizadorComprasController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um utilizador da loja com os dados novos pelo id
export const updateUtilizadorCompras = async (req,res) => {
    const {id} = req.params;
    const {nome,email,telemovel,password} = req.body
    const password_hash = await argon2.hash(password)

    try {
        if(!nome || !email || !telemovel || !password_hash || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE utilizador_compras SET nome=$1, email=$2, telemovel=$3, password_hash=$4 WHERE id_utilizador_compras=$5 RETURNING *`,[nome,email,telemovel,password_hash,id])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateUtilizadorCompras do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateUtilizadorCompras do utilizadorComprasController.js"})
    }
}

//atualizar um utilizador da loja com os dados novos pelo id, sem alterar a palavra-passe
export const updateUtilizadorComprasPasswordless = async (req,res) => {
    const {id} = req.params;
    const {nome,email,telemovel} = req.body

    try {
        if(!nome || !email || !telemovel || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE utilizador_compras SET nome=$1, email=$2, telemovel=$3 WHERE id_utilizador_compras=$4 RETURNING *`,[nome,email,telemovel,id])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateUtilizadorComprasPasswordless do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateUtilizadorComprasPasswordless do utilizadorComprasController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um utilizador da loja atraves do seu id
export const deleteUtilizadorCompras = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM utilizador_compras WHERE id_utilizador_compras=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteUtilizadorCompras do utilizadorComprasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteUtilizadorCompras do utilizadorComprasController.js"})
    }
}

