import pool from "../config/db.js"

//Controlador para a tabela dos explicadores

/////////
/////GET
/////////

//receber todos os explicadores
export const getAllExplicadores = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM explicador");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllExplicadores do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllExplicadores do explicadorController.js"})
    }
}

//receber um explicador pelo id
export const getExplicador = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM explicador WHERE id_explicador=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getExplicador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicador do explicadorController.js"})
    }
}

//receber um explicador pelo id de utilizador
export const getExplicadorByUtilizador = async (req,res) => {
    const {id_utilizador} = req.params;

    try{
        if(!id_utilizador){
            res.status(400).json({message: "id de utilizador não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM explicador WHERE id_utilizador=$1`, [id_utilizador]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getExplicadorByUtilizador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicadorByUtilizador do explicadorController.js"})
    }
}

//receber os explicadores com os dados do utilizador
export const getExplicadoresAndUtilizador = async (req,res) => {
    try{
        const RESULT = await pool.query(
            `SELECT u.id_utilizador, u.nome, u.email, u.telemovel, e.id_explicador, e.especialidades, e.habilitacoes, e.valor_hora
            FROM utilizador u INNER JOIN explicador e ON u.id_utilizador = e.id_utilizador WHERE u.tipo='explicador'`);
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getExplicadoresAndUtilizador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicadoresAndUtilizador do explicadorController.js"})
    }
}

//////////
/////POST
//////////

//criar um novo explicador na base de dados
export const createExplicador = async (req,res) => {
    const {especialidades,habilitacoes,valor_hora,id_utilizador} = req.body;

    try{
        if(!especialidades || !habilitacoes || !id_utilizador){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO explicador (especialidades, habilitacoes, valor_hora, id_utilizador) VALUES ($1, $2, $3, $4) RETURNING *", [especialidades,habilitacoes,valor_hora,id_utilizador]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createExplicador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createExplicador do explicadorController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um explicador com os dados novos pelo id
export const updateExplicador = async (req,res) => {
    const {especialidades,habilitacoes,valor_hora,id_utilizador} = req.body;
    const {id} = req.params;

    try{
        if(!especialidades || !habilitacoes || !id_utilizador || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE explicador SET especialidades=$1, habilitacoes=$2, valor_hora=$3, id_utilizador=$4 WHERE id_explicador=$5 RETURNING *", [especialidades,habilitacoes,valor_hora,id_utilizador,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateExplicador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateExplicador do explicadorController.js"})
    }
}

//atualizar um explicador com os dados novos pelo id
export const updateExplicadorByUserID = async (req,res) => {
    const {especialidades,habilitacoes} = req.body;
    const {id} = req.params;

    try{
        if(!especialidades || !habilitacoes || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE explicador SET especialidades=$1, habilitacoes=$2 WHERE id_utilizador=$3 RETURNING *", [especialidades,habilitacoes,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateExplicadorByUserID do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateExplicadorByUserID do explicadorController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar um explicador atraves do seu id
export const deleteExplicador = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM explicador WHERE id_explicador=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteExplicador do explicadorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteExplicador do explicadorController.js"})
    }
}