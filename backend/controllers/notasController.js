import pool from "../config/db.js"

//Controlador para a tabela das notas

/////////
/////GET
/////////

//receber todas as notas
export const getAllNotas = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM notas");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllNotas do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllNotas do notasController.js"})
    }
}

//receber uma nota pelo id
export const getNota = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM notas WHERE id_notas=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getNota do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getNota do notasController.js"})
    }
}

//////////
/////POST
//////////

//criar uma nova nota na base de dados
export const createNota = async (req,res) => {
    const {data_avaliacao,descricao,valor,id_disciplina,id_explicando} = req.body;

    try{
        if(!valor || !id_disciplina || !id_explicando){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO notas (data_avaliacao, descricao, valor, id_disciplina, id_explicando) VALUES ($1, $2, $3, $4, $5) RETURNING *", [data_avaliacao,descricao,valor,id_disciplina,id_explicando]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createNota do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createNota do notasController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar uma nota com os dados novos pelo id
export const updateNota = async (req,res) => {
    const {data_avaliacao,descricao,valor,id_disciplina,id_explicando} = req.body;
    const {id} = req.params;

    try{
        if(!valor || !id_disciplina || !id_explicando || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE notas SET data_avaliacao=$1, descricao=$2, valor=$3, id_disciplina=$4, id_explicando=$5 WHERE id_notas=$6 RETURNING *", [data_avaliacao,descricao,valor,id_disciplina,id_explicando,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateNota do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateNota do notasController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar uma nota atraves do seu id
export const deleteNota = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM notas WHERE id_notas=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteNota do notasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteNota do notasController.js"})
    }
}