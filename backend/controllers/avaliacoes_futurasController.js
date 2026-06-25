import pool from "../config/db.js"

//Controlador para a tabela das avaliacoes_futuras

/////////
/////GET
/////////

//receber todas as avaliacoes futuras
export const getAllAvalFuturas = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM avaliacoes_futuras");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllAvalFuturas do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllAvalFuturas do avaliacoes_futurasController.js"})
    }
}

//receber uma avaliacao futura pelo id
export const getAvalFutura = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM avaliacoes_futuras WHERE id_avaliacoes=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getAvalFutura do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAvalFutura do avaliacoes_futurasController.js"})
    }
}

//////////
/////POST
//////////

//criar uma nova avaliacao futura na base de dados
export const createAvalFutura = async (req,res) => {
    const {data,disciplina,descricao,id_explicando} = req.body;

    try{
        if(!data || !id_explicando){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO avaliacoes_futuras (data, disciplina, descricao, id_explicando) VALUES ($1, $2, $3, $4) RETURNING *", [data,disciplina,descricao,id_explicando]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createAvalFutura do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createAvalFutura do avaliacoes_futurasController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar uma avaliacao futura com os dados novos pelo id
export const updateAvalFutura = async (req,res) => {
    const {data,disciplina,descricao,id_explicando} = req.body;
    const {id} = req.params;

    try{
        if(!data || !id_explicando || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE avaliacoes_futuras SET data=$1, disciplina=$2, descricao=$3, id_explicando=$4 WHERE id_avaliacoes=$5 RETURNING *", [data,disciplina,descricao,id_explicando,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateAvalFutura do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateAvalFutura do avaliacoes_futurasController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar uma avaliacao futura atraves do seu id
export const deleteAvalFutura = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM avaliacoes_futuras WHERE id_avaliacoes=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteAvalFutura do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteAvalFutura do avaliacoes_futurasController.js"})
    }
}