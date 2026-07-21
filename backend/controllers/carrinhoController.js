import pool from "../config/db.js"

//Controlador para a tabela do carinho dos utilizadores da loja

/////////
/////GET
/////////

//receber todos os carrinhos
export const getAllCarrinhos = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from carrinho`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllCarrinhos do carrinhoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllCarrinhos do carrinhoController.js"})
    }
}

//receber carrinho pelo id
export const getCarrinho = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from carrinho WHERE id_carrinho=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getCarrinho do carrinhoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getCarrinho do carrinhoController.js"})
    }
}

/////////
/////POST
/////////

//criar novo carrinho
export const createCarrinho = async (req,res) => {
    const {id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO carrinho (id_utilizador_compras) VALUES ($1) RETURNING *`,[id_utilizador_compras])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createCarrinho do carrinhoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createCarrinho do carrinhoController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um carrinho com os dados novos pelo id
export const updateCarrinho = async (req,res) => {
    const {id} = req.params;
    const {id_utilizador_compras} = req.body

    try {
        if(!id_utilizador_compras || !id){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE carrinho SET id_utilizador_compras=$1 WHERE id_carrinho=$2 RETURNING *`,[id_utilizador_compras,id])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateCarrinho do carrinhoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateCarrinho do carrinhoController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um carrinho atraves do seu id
export const deleteCarrinho = async (req,res) => {
    const {id} = req.params;

    try{
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query("DELETE FROM carrinho WHERE id_carrinho=$1 RETURNING *", [id]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteCarrinho do carrinhoController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteCarrinho do carrinhoController.js"})
    }
}

