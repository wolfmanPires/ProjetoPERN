import express from "express";
import helmet from "helmet";   //Helmet e um middleware de seguranca que facilita a configuracao de ferramentas de protecao da app atraves de headers HTTP
import morgan from "morgan";   //Morgan perseva os pedidos de header HTTP num ficheiro log
import cors from "cors";       //Permite suprimir os erros de CORS dos browsers
import dotenv from "dotenv";   //Acesso as variaveis de ambiente do ficheiro .env

import productRoutes from "./routes/productRoutes.js";
import pool from "./config/db.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/router", productRoutes)

//Funcao que verifica se ha a DB no sistema, caso nao entao vai criar as tabelas necessarias
async function initDB() {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `)
    }catch(err){
        console.log("Erro na funcao initDB de server.js", err)
    }
}

initDB().then(() => {
    app.listen(PORT,()=>{
        console.log("Servidor ExpressJS ativo na port "+PORT)
    })
})