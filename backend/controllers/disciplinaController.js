import pool from "../config/db.js"

//Controlador para a tabela das disciplinas

/////////
/////GET
/////////

//receber todas as disciplinas
export const getAllDisciplinas = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM disciplina");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllDisciplinas do disciplinaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllDisciplinas do disciplinaController.js"})
    }
}

//receber uma disciplina pelo id
export const getDisciplina = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM disciplina WHERE id_disciplina=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getDisciplina do disciplinaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getDisciplina do disciplinaController.js"})
    }
}

//////////
/////POST
//////////

//criar uma nova disciplina na base de dados
export const createDisciplina = async (req,res) => {
    const {nome,ano,area_cientifica} = req.body;

    try{
        if(!nome || !ano || !area_cientifica){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO disciplina (nome, ano, area_cientifica) VALUES ($1, $2, $3) RETURNING *", [nome,ano,area_cientifica]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createDisciplina do disciplinaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createDisciplina do disciplinaController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar uma disciplina com os dados novos pelo id
export const updateDisciplina = async (req,res) => {
    const {nome,ano,area_cientifica} = req.body;
    const {id} = req.params;

    try{
        if(!nome || !ano || !area_cientifica || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE disciplina SET nome=$1, ano=$2, area_cientifica=$3 WHERE id_disciplina=$4 RETURNING *", [nome,ano,area_cientifica,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateDisciplina do disciplinaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateDisciplina do disciplinaController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar uma disciplina atraves do seu id
export const deleteDisciplina = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM disciplina WHERE id_disciplina=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteDisciplina do disciplinaController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteDisciplina do disciplinaController.js"})
    }
}