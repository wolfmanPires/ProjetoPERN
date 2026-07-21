import pool from "../config/db.js"
import argon2 from "argon2";

//Controlador para a tabela dos utilizadores

/////////
/////GET
/////////

//receber todos os utilizadores
export const getAllUtilizadores = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM utilizador");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllUtilizadores do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllUtilizadores do utilizadorController.js"})
    }
}

//receber um utilizador pelo id
export const getUtilizador = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM utilizador WHERE id_utilizador=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getUtilizador do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getUtilizador do utilizadorController.js"})
    }
}

//receber utilizadores que sao gestores
export const getUtilizadorAsGestores = async (req,res) => {

    try{
        const RESULT = await pool.query(`SELECT * FROM utilizador WHERE tipo='gestor'`);
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getUtilizadorAsGestores do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getUtilizadorAsGestores do utilizadorController.js"})
    }
}

//receber utilizadores (dados limitados)
export const getUtilizadorLimited = async (req,res) => {

    try{
        const RESULT = await pool.query(`SELECT u.id_utilizador, u.nome, u.email, u.tipo, u.telemovel FROM utilizador u`);
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getUtilizadorAsGestores do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getUtilizadorAsGestores do utilizadorController.js"})
    }
}

//////////
/////POST
//////////

//criar um novo utilizador na base de dados
export const createUtilizador = async (req,res) => {
    const {nome,email,telemovel,tipo,password} = req.body;
    const password_hash = await argon2.hash(password);

    try{
        if(!nome || !email || !telemovel || !tipo || !password_hash){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO utilizador (nome, email, telemovel, tipo, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nome,email,telemovel,tipo,password_hash]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createUtilizador do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createUtilizador do utilizadorController.js"})
    }
}

//Verificar se a palavra-passe dada para uma conta esta correta
export const verificaPassword = async (req,res) => {
    const {email,password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message: "E-mail ou palavra-passe em falta, por favor tente de novo"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM utilizador WHERE email=$1`, [email])
            const user = RESULT.rows[0];
            if(!user){
                //O Email nao existe
                return res.status(401).json({message: "Dados incorretos, por favor tente de novo."})
            }else{
                //Verifica a palavra-passe
                const validPassword = await argon2.verify(
                    user.password_hash, password
                )

                //Caso invalida, manda erro
                if(!validPassword){
                    return res.status(401).json({message: "Dados incorretos, por favor tente de novo."})
                }

                //Caso correta, guarda na sessao o utilizador
                req.session.user = {
                    id_utilizador: user.id_utilizador,
                    nome: user.nome,
                    email: user.email,
                    tipo: user.tipo,
                    telemovel: user.telemovel
                }
                res.status(200).json({
                    user: req.session.user
                })
            }
        }
    } catch (err) {
        console.error("Erro detetado no verificaPassword do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no verificaPassword do utilizadorController.js"})
    }
}

//Tratar do logout da sessao corrente
export const logout = async (req,res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({message:"Erro ao terminar sessão."})
        } 

        res.clearCookie("connect.sid")

        return res.status(200).json({message:"Sessão terminada com sucesso."})
    })
}

/////////
/////PUT
/////////

//atualizar um utilizador com os dados novos pelo id
export const updateUtilizador = async (req,res) => {
    const {nome,email,telemovel,tipo,password} = req.body;
    const {id} = req.params;
    const password_hash = await argon2.hash(password);

    try{
        if(!nome || !email || !telemovel || !tipo || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE utilizador SET nome=$1, email=$2, telemovel=$3, tipo=$4, password_hash=$5 WHERE id_utilizador=$6 RETURNING *", [nome,email,telemovel,tipo,password_hash,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateUtilizador do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateUtilizador do utilizadorController.js"})
    }
}

//atualizar um utilizador so no nome, email e telemovel
export const updateUtilizadorNET = async (req,res) => {
    const {nome,email,telemovel} = req.body;
    const {id} = req.params;

    try{
        if(!nome || !email || !telemovel || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE utilizador SET nome=$1, email=$2, telemovel=$3 WHERE id_utilizador=$4 RETURNING *", [nome,email,telemovel,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateUtilizadorNET do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateUtilizadorNET do utilizadorController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar um utilizador atraves do seu id
export const deleteUtilizador = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM utilizador WHERE id_utilizador=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteUtilizador do utilizadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteUtilizador do utilizadorController.js"})
    }
}