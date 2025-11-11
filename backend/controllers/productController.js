import pool from "../config/db.js"

//sistema de verificacao com erros (nao deixar DB ser corrompida)
export const getAllProducts = async (req,res) => {
    try{
        const RESULT = await pool.query("SELECT * FROM products");
        res.status(200).json(RESULT.rows);
    }catch (err){
        console.error("Erro detetado no getAllProducts do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllProducts do productController.js"})
    }
}

export const createProduct = async (req,res) => {
    const {NAME,PRICE} = req.body;

    try{
        const RESULT = await pool.query("INSERT INTO products (name, price) VALUES ($1,$2) RETURNING *", [NAME,PRICE]);
        res.status(201).json(RESULT.rows[0]);
    }catch (err){
        console.error("Erro detetado no createProduct do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createProduct do productController.js"})
    }
}