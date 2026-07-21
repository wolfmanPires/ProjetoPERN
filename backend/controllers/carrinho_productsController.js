import pool from "../config/db.js"

//Controlador para a tabela dos carrinhos mista com produtos

/////////
/////GET
/////////

//receber todos os carrinhos+produtos
export const getAllCarrinhosProdutos = async (req,res) => {
    try {
        const RESULT = await pool.query(`SELECT * from carrinho_products`)
        res.status(200).json(RESULT.rows)
    } catch (err) {
        console.error("Erro detetado no getAllCarrinhosProdutos do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllCarrinhosProdutos do carrinho_productsController.js"})
    }
}

//receber carrinho+produto pelo id do carrinho
export const getCarrinhoProdutoFromCarrinhoID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from carrinho_products WHERE id_carrinho=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getCarrinhoProdutoFromCarrinhoID do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getCarrinhoProdutoFromCarrinhoID do carrinho_productsController.js"})
    }
}

//receber carrinho+produto pelo id do produto
export const getCarrinhoProdutoFromProductID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from carrinho_products WHERE id_products=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getCarrinhoProdutoFromProductID do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getCarrinhoProdutoFromProductID do carrinho_productsController.js"})
    }
}

//receber carrinho+produto pelos 2 ids
export const getCarrinhoProdutoFromBothID = async (req,res) => {
    const {id_carrinho,id_products} = req.params;

    try {
        if(!id_carrinho || !id_products){
            res.status(400).json({message: "ids não existentes, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from carrinho_products WHERE id_carrinho=$1 AND id_products=$2`,[id_carrinho,id_products])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getCarrinhoProdutoFromBothID do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getCarrinhoProdutoFromBothID do carrinho_productsController.js"})
    }
}

//receber carrinho pelo id do utilizador de compra
export const getCarrinhoFromUserCompraID = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(`SELECT * from carrinho WHERE id_utilizador_compras=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getCarrinhoFromUserCompraID do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getCarrinhoFromUserCompraID do carrinho_productsController.js"})
    }
}

//receber todos os produtos associados a um dado carrinho, e a quantidade que o carrinho querer comprar
export const getAllProductsFromCarrinho = async (req,res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).json({message: "id não existente, por favor tente outro"})
        }else{
            const RESULT = await pool.query(
                `SELECT p.*, cp.quantidade FROM carrinho_products cp INNER JOIN products p ON p.id_products = cp.id_products
                WHERE cp.id_carrinho=$1`,[id])
            res.status(200).json(RESULT.rows)
        }
    } catch (err) {
        console.error("Erro detetado no getAllProductsFromCarrinho do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no getAllProductsFromCarrinho do carrinho_productsController.js"})
    }
}

/////////
/////POST
/////////

//criar novo carrinho+produto
export const createCarrinhoProduto = async (req,res) => {
    const {quantidade,id_carrinho,id_products} = req.body

    try {
        if(!quantidade || !id_carrinho || !id_products){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`INSERT INTO carrinho_products (id_carrinho, id_products, quantidade) VALUES ($1, $2, $3) RETURNING *`,[id_carrinho,id_products,quantidade])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no createCarrinhoProduto do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no createCarrinhoProduto do carrinho_productsController.js"})
    }
}

/////////
/////PUT
/////////

//atualizar um carrinho+produto com os dados novos pelos ids do carrinho e produto
export const updateCarrinhoProduto = async (req,res) => {
    const {quantidade,id_carrinho,id_products} = req.body

    try {
        if(!quantidade || !id_carrinho || !id_products){
            res.status(400).json({message: "Dados formatados incorretamente, por favor verifique se falta algo e re-envie"})
        }else{
            const RESULT = await pool.query(`UPDATE carrinho_products SET quantidade=$1 WHERE id_carrinho=$2 AND id_products=$3 RETURNING *`,[quantidade,id_carrinho,id_products])
            res.status(201).json(RESULT.rows[0]);
        }
    } catch (err) {
        console.error("Erro detetado no updateCarrinhoProduto do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no updateCarrinhoProduto do carrinho_productsController.js"})
    }
}

/////////
/////DELETE
/////////

//apagar um carrinho+produto atraves dos seus ids
export const deleteCarrinhoProduto = async (req,res) => {
    const {id_carrinho,id_products} = req.body;

    try{
        if(!id_carrinho || !id_products){
            res.status(400).json({message: "ids não existente, por favor tente outros"})
        }else{
            const RESULT = await pool.query("DELETE FROM carrinho_products WHERE id_carrinho=$1 AND id_products=$2 RETURNING *", [id_carrinho,id_products]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteCarrinhoProduto do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteCarrinhoProduto do carrinho_productsController.js"})
    }
}

//apagar todos os produtos de um dado carrinho
export const deleteCarrinhoAllProducts = async (req,res) => {
    const {id_carrinho} = req.params;

    try{
        if(!id_carrinho){
            res.status(400).json({message: "ids não existente, por favor tente outros"})
        }else{
            const RESULT = await pool.query("DELETE FROM carrinho_products WHERE id_carrinho=$1 RETURNING *", [id_carrinho]);
            res.status(200).json(RESULT.rows[0]);
        }
    }catch (err){
        console.error("Erro detetado no deleteCarrinhoAllProducts do carrinho_productsController.js: ",err);
        //Enviar codigo de erro interno de servidor 
        res.status(500).json({message: "Erro detetado no deleteCarrinhoAllProducts do carrinho_productsController.js"})
    }
}