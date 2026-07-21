import pool from "../config/db.js"

//Controlador para a tabela dos gestores da loja

/////////
/////GET
/////////

//receber todos os gestores da loja
export const getAllGestores = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from gestor`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllGestores do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllGestores do gestorController.js"})
    }
}

//receber gestor da loja pelo id
export const getGestor = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from gestor WHERE id_gestor=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getGestor do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getGestor do gestorController.js"})
    }
}

//receber gestor da loja pelo id de utilizador da loja
export const getGestorByUserID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from gestor WHERE id_utilizador_compras=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getGestorByUserID do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getGestorByUserID do gestorController.js"})
    }
}

/////////
/////POST
/////////

//criar novo gestor da loja
export const createGestor = async (req,res) => {
    const {id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO gestor (id_utilizador_compras) VALUES ($1) RETURNING *`,[id_utilizador_compras])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createGestor do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createGestor do gestorController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um gestor da loja com os dados novos pelo id
export const updateGestor = async (req,res) => {
    const {id} = req.params;
    const {id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE gestor SET id_utilizador_compras=$1 WHERE id_gestor=$2 RETURNING *`,[id_utilizador_compras,id])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateGestor do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateGestor do gestorController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um gestor da loja atraves do seu id
export const deleteGestor = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM gestor WHERE id_gestor=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteGestor do gestorController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteGestor do gestorController.js"})
    }
}

