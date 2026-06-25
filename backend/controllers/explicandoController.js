import pool from "../config/db.js"

//Controlador para a tabela dos explicandos

/////////
/////GET
/////////

//receber todos os explicandos
export const getAllExplicandos = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM explicando");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllExplicandos do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllExplicandos do explicandoController.js"})
    }
}

//receber um explicando pelo id
export const getExplicando = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM explicando WHERE id_explicando=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getExplicando do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicando do explicandoController.js"})
    }
}

//receber um explicando pelo id de utilizador
export const getExplicandoByUtilizador = async (req,res) => {
    const {id_utilizador} = req.params;

    try{
        if(!id_utilizador){
            res.status(400).json({message: "id de utilizador não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM explicando WHERE id_utilizador=$1`, [id_utilizador]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getExplicandoByUtilizador do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicandoByUtilizador do explicandoController.js"})
    }
}

//////////
/////POST
//////////

//criar um novo explicando na base de dados
export const createExplicando = async (req,res) => {
    const {dificuldades,id_utilizador} = req.body;

    try{
        if(!dificuldades || !id_utilizador){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO explicando (dificuldades, id_utilizador) VALUES ($1, $2) RETURNING *", [dificuldades,id_utilizador]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createExplicando do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createExplicando do explicandoController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um explicando com os dados novos pelo id
export const updateExplicando = async (req,res) => {
    const {dificuldades,id_utilizador} = req.body;
    const {id} = req.params;

    try{
        if(!dificuldades || !id_utilizador || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE explicando SET dificuldades=$1, id_utilizador=$2 WHERE id_explicando=$3 RETURNING *", [dificuldades,id_utilizador,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateExplicando do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateExplicando do explicandoController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar um explicando atraves do seu id
export const deleteExplicando = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM explicando WHERE id_explicando=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteExplicando do explicandoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteExplicando do explicandoController.js"})
    }
}