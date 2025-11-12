import pool from "../config/db.js"

//sistema de verificacao com erros (nao deixar DB ser corrompida)

/////////
/////GET
/////////

//receber todos os dados da tabela dos produtos
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

//receber um elemento especifico da tabela dos produtos pelo ID
export const getProduct = async (req,res) => {
    const {ID} = req.params;

    try{
        if(!ID){
            res.status(400).json({message: "ID não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("SELECT * FROM products WHERE id=$1", [ID]);
            res.status(200).json(RESULT.rows);
        }
    }catch (err){
        console.error("Erro detetado no getAllProducts do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllProducts do productController.js"})
    }
}

//////////
/////POST
//////////

//criar um novo produto na base de dados
export const createProduct = async (req,res) => {
    const {NAME,PRICE,IMAGE} = req.body;

    try{
        if(!NAME || !PRICE || !IMAGE){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("INSERT INTO products (name, price, image) VALUES ($1,$2,$3) RETURNING *", [NAME,PRICE,IMAGE]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createProduct do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createProduct do productController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um produto com os dados novos pelo ID
export const updateProduct = async (req,res) => {
    const {NAME,PRICE,IMAGE} = req.body;
    const {ID} = req.params;

    try{
        if(!NAME || !PRICE || !IMAGE || !ID){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query("UPDATE products SET name=$1, price=$2, image=$3 WHERE id=$4 RETURNING *", [NAME,PRICE,IMAGE,ID]);
            res.status(201).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no updateProduct do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateProduct do productController.js"})
    }
}

////////////
/////DELETE
////////////

//apagar um produto atraves do seu ID
export const deleteProduct = async (req,res) => {
    const {ID} = req.params;

    try{
        if(!ID){
            res.status(400).json({message: "ID não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [ID]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no createProduct do productController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createProduct do productController.js"})
    }
}
