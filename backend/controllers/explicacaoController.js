import pool from "../config/db.js"

//Controlador para a tabela das explicacoes

/////////
/////GET
/////////

//receber todas as explicacoes
export const getAllExplicacoes = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM explicacao");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllExplicacoes do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllExplicacoes do explicacaoController.js"})
    }
}

//receber uma explicacao pelo id
export const getExplicacao = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * FROM explicacao WHERE id_explicacao=$1`, [id]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getExplicacao do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicacao do explicacaoController.js"})
    }
}

//Receber explicacoes pelo id do explicador
export const getExplicacaoByExplicador = async (req,res) => {
    const {id_explicador} = req.params;

    try {
        if(!id_explicador){
            res.status(400).json({message: "id de explicador não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT e.id_explicacao, e.data_inicio, e.data_fim, e.lecionada, e.descricao, ex.id_explicando, u.nome
                FROM explicacao e INNER JOIN explicando ex ON e.id_explicando = ex.id_explicando 
                INNER JOIN utilizador u ON ex.id_utilizador = u.id_utilizador WHERE e.id_explicador=$1`, [id_explicador]);
            res.status(200).json(RESULT.rows);
        }
    } catch (err) {
        console.error("Erro detetado no getExplicacaoByExplicador do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicacaoByExplicador do explicacaoController.js"})
    }
}

//Receber explicacoes pelo id do explicando
export const getExplicacaoByExplicando = async (req,res) => {
    const {id_explicando} = req.params;

    try {
        if(!id_explicando){
            res.status(400).json({message: "id de explicando não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT e.id_explicacao, e.data_inicio, e.data_fim, e.lecionada, e.descricao, ex.id_explicador, u.nome
                FROM explicacao e INNER JOIN explicador ex ON e.id_explicador = ex.id_explicador 
                INNER JOIN utilizador u ON ex.id_utilizador = u.id_utilizador WHERE e.id_explicando=$1`, [id_explicando]);
            res.status(200).json(RESULT.rows);
        }
    } catch (err) {
        console.error("Erro detetado no getExplicacaoByExplicando do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getExplicacaoByExplicando do explicacaoController.js"})
    }
}

//////////
/////POST
//////////

//criar uma nova explicacao na base de dados
export const createExplicacao = async (req,res) => {
    const {data_inicio,data_fim,lecionada,descricao,id_explicador,id_disciplina,id_explicando} = req.body;
    
    try{
        if(!data_inicio || !data_fim || !id_explicador || !id_disciplina || !id_explicando){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO explicacao (data_inicio, data_fim, lecionada, descricao, id_explicador, id_disciplina, id_explicando) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [data_inicio,data_fim,lecionada,descricao,id_explicador,id_disciplina,id_explicando]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createExplicacao do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createExplicacao do explicacaoController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar uma explicacao com os dados novos pelo id
export const updateExplicacao = async (req,res) => {
    const {data_inicio,data_fim,lecionada,descricao,id_explicador,id_disciplina,id_explicando} = req.body;
    const {id} = req.params;

    try{
        if(!data_inicio || !data_fim || !id_explicador || !id_disciplina || !id_explicando || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE explicacao SET data_inicio=$1, data_fim=$2, lecionada=$3, descricao=$4, id_explicador=$5, id_disciplina=$6, id_explicando=$7 WHERE id_explicacao=$8 RETURNING *", [data_inicio,data_fim,lecionada,descricao,id_explicador,id_disciplina,id_explicando,id]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateExplicacao do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateExplicacao do explicacaoController.js"})
    }
}

//muda o estado de lecionado da explicacao
export const updateLecionada = async (req,res) => {
    const {id_explicacao} = req.params;
    const {lecionada} = req.body;

    try {
        if(!id_explicacao){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULTchange = await pool.query("UPDATE explicacao SET lecionada = $1 WHERE id_explicacao = $2 RETURNING *",[lecionada,id_explicacao])
            const RESULT = await pool.query(
                `SELECT e.id_explicacao, e.data_inicio, e.data_fim, e.lecionada, e.descricao, ex.id_explicando, u.nome
                FROM explicacao e INNER JOIN explicando ex ON e.id_explicando = ex.id_explicando 
                INNER JOIN utilizador u ON ex.id_utilizador = u.id_utilizador WHERE e.id_explicacao=$1`, [id_explicacao]);
            res.status(200).json(RESULT.rows[0])
        }
    } catch (err) {
        console.error("Erro detetado no updateLecionada do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateLecionada do explicacaoController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar uma explicacao atraves do seu id
export const deleteExplicacao = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM explicacao WHERE id_explicacao=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteExplicacao do explicacaoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteExplicacao do explicacaoController.js"})
    }
}