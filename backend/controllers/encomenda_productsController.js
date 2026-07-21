import pool from "../config/db.js"

//Controlador para a tabela dos encomendas mista com produtos

/////////
/////GET
/////////

//receber todos os encomendas+produtos
export const getAllEncomendasProdutos = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from encomenda_products`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllCarrinhosProdutos do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllCarrinhosProdutos do encomenda_productsController.js"})
    }
}

//receber encomenda+produto pelo id do encomenda
export const getEncomendaProdutoFromEncomendaID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from encomenda_products WHERE id_encomenda=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getEncomendaProdutoFromEncomendaID do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getEncomendaProdutoFromEncomendaID do encomenda_productsController.js"})
    }
}

//receber encomenda+produto pelo id do produto
export const getEncomendaProdutoFromProductID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from encomenda_products WHERE id_products=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getEncomendaProdutoFromProductID do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getEncomendaProdutoFromProductID do encomenda_productsController.js"})
    }
}

//receber encomenda+produto pelos 2 ids
export const getEncomendaProdutoFromBothID = async (req,res) => {
    const {id_encomenda,id_products} = req.body;

    try {
        if(!id_encomenda || !id_products){
            res.status(400).json({message: "ids não existentes, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from encomenda_products WHERE id_encomenda=$1 AND id_products=$2`,[id_encomenda,id_products])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getEncomendaProdutoFromBothID do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getEncomendaProdutoFromBothID do encomenda_productsController.js"})
    }
}

//receber todos os produtos associados a um dado carrinho, e a quantidade que o carrinho querer comprar
export const getAllProductsFromEncomenda = async (req,res) => {
    const {id} = req.params;
    
    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT p.*, ep.quantidade, ep.preco_unitario FROM encomenda_products ep INNER JOIN products p ON p.id_products = ep.id_products
                WHERE ep.id_encomenda=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getAllProductsFromEncomenda do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllProductsFromEncomenda do encomenda_productsController.js"})
    }
}

/////////
/////POST
/////////

//criar novo encomenda+produto
export const createEncomendaProduto = async (req,res) => {
    const {quantidade,preco_unitario,id_encomenda,id_products} = req.body

    try {
        if(!quantidade || !preco_unitario || !id_encomenda || !id_products){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO encomenda_products (id_encomenda, id_products, quantidade, preco_unitario) VALUES ($1, $2, $3) RETURNING *`,[id_encomenda,id_products,quantidade,preco_unitario])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createEncomendaProduto do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createEncomendaProduto do encomenda_productsController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um encomenda+produto com os dados novos pelos ids do carrinho e produto
export const updateEncomendaProduto = async (req,res) => {
    const {quantidade,preco_unitario,id_encomenda,id_products} = req.body

    try {
        if(!quantidade || !preco_unitario || !id_encomenda || !id_products){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE encomenda_products SET quantidade=$1, preco_unitario=$2 WHERE id_encomenda=$3 AND id_products=$4 RETURNING *`,[quantidade,preco_unitario,id_encomenda,id_products])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateEncomendaProduto do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateEncomendaProduto do encomenda_productsController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um encomenda+produto atraves dos seus ids
export const deleteEncomendaProduto = async (req,res) => {
    const {id_encomenda,id_products} = req.body;

    try{
        if(!id_encomenda || !id_products){
            res.status(400).json({message: "ids não existente, por favor tente outros"})
        }else{
            const RESULT = await pool.query("DELETE FROM encomenda_products WHERE id_encomenda=$1 AND id_products=$2 RETURNING *", [id_encomenda,id_products]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteEncomendaProduto do encomenda_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteEncomendaProduto do encomenda_productsController.js"})
    }
}

