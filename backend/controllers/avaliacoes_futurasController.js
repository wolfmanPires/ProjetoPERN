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

//receber avaliacoes futuras com dados de explicandos e disciplinas
export const getAllAvalFuturasWithUtilizador = async (req,res) => {
    try{
        const RESULT = await pool.query(
            `SELECT a.id_avaliacoes, a.data, a.descricao, a.id_disciplina, a.id_explicando, d.nome AS disciplina_nome, d.ano, u.nome AS explicando_nome
            FROM avaliacoes_futuras a INNER JOIN disciplina d ON a.id_disciplina = d.id_disciplina 
            INNER JOIN explicando e ON a.id_explicando = e.id_explicando
            INNER JOIN utilizador u ON e.id_utilizador = u.id_utilizador
            ORDER BY a.data DESC;`
        );
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllNotasWithUtilizador do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllNotasWithUtilizador do avaliacoes_futurasController.js"})
    }
}

//receber todas as avaliacoes futuras dos explicandos que tem explicacoes com um dado explicador
export const getAllAvalFuturasOfExplicador = async (req,res) => {
    const {id_explicador} = req.params;

    try {
        if(!id_explicador){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT af.id_avaliacoes, af.data, af.descricao, af.id_explicando, af.id_disciplina, u.nome AS nome_explicando, d.nome AS nome_disciplina, d.ano
                FROM avaliacoes_futuras af INNER JOIN (SELECT DISTINCT id_explicando FROM explicacao WHERE id_explicador = $1) alunos ON af.id_explicando = alunos.id_explicando
                INNER JOIN explicando ex ON af.id_explicando = ex.id_explicando INNER JOIN utilizador u ON ex.id_utilizador = u.id_utilizador
                INNER JOIN disciplina d ON af.id_disciplina = d.id_disciplina ORDER BY af.data;`,
                [id_explicador]
            )
            res.status(200).json(RESULT.rows);
        }
        
    } catch (err) {
        console.error("Erro detetado no getAllAvalFuturasOfExplicador do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllAvalFuturasOfExplicador do avaliacoes_futurasController.js"})
    }
}

//receber avaliacoes futuras de dado explicando
export const getAllAvalFuturasOfExplicando = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT a.id_avaliacoes, a.data, a.descricao, a.id_disciplina, a.id_explicando, d.nome AS disciplina_nome, d.ano, u.nome AS explicando_nome
                FROM avaliacoes_futuras a INNER JOIN disciplina d ON a.id_disciplina = d.id_disciplina 
                INNER JOIN explicando e ON a.id_explicando = e.id_explicando
                INNER JOIN utilizador u ON e.id_utilizador = u.id_utilizador
                WHERE u.id_utilizador = $1 ORDER BY a.data DESC;`, [id]
            );
            res.status(200).json(RESULT.rows);
        }
        
    }catch (err){
        console.error("Erro detetado no getAllAvalFuturasOfExplicando do avaliacoes_futurasController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllAvalFuturasOfExplicando do avaliacoes_futurasController.js"})
    }
}

//////////
/////POST
//////////

//criar uma nova avaliacao futura na base de dados
export const createAvalFutura = async (req,res) => {
    const {data,descricao,id_explicando,id_disciplina} = req.body;

    try{
        if(!data || !id_explicando || !id_disciplina){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO avaliacoes_futuras (data, descricao, id_explicando, id_disciplina) VALUES ($1, $2, $3, $4) RETURNING *", [data,descricao,id_explicando,id_disciplina]);
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
    const {data,descricao,id_explicando,id_disciplina} = req.body;
    const {id} = req.params;

    try{
        if(!data || !id_explicando || !id_disciplina || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE avaliacoes_futuras SET data=$1, id_disciplina=$2, descricao=$3, id_explicando=$4 WHERE id_avaliacoes=$5 RETURNING *", [data,id_disciplina,descricao,id_explicando,id]);
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