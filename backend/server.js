
//Imports dos pacotes de dependencias
import express from "express";
import helmet from "helmet";    //Helmet e um middleware de seguranca que facilita a configuracao de ferramentas de protecao da app atraves de headers HTTP
import morgan from "morgan";    //Morgan escreve os pedidos de header HTTP feitos na consola
import cors from "cors";        //Permite suprimir os erros de CORS dos browsers
import dotenv from "dotenv";    //Acesso as variaveis de ambiente do ficheiro .env
import session from "express-session"               //Trata de guardar a sessao de Login dos utilizadores
import connectPgSimple from "connect-pg-simple";    //Simplifica as conexoes de sessoes

//Imports dos controladores para a base de dados
import productRoutes from "./routes/productRoutes.js"
import utilizadorRoutes from "./routes/utilizadorRoutes.js"
import disciplinaRoutes from "./routes/disciplinaRoutes.js"
import explicadorRoutes from "./routes/explicadorRoutes.js"
import explicandoRoutes from "./routes/explicandoRoutes.js"
import pagamentoRoutes from "./routes/pagamentoRoutes.js"
import explicacaoRoutes from "./routes/explicacaoRoutes.js"
import avaliacoes_futurasRoutes from "./routes/avaliacoes_futurasRoutes.js"
import notasRoutes from "./routes/notasRoutes.js"
import loginRoutes from "./routes/LoginRoutes.js"
import activeSessionRoutes from "./routes/activeSessionRoutes.js"
import gestorSessionRoutes from "./routes/gestorSessionRoutes.js"
import utilizadorComprasRoutes from "./routes/utilizadorComprasRoutes.js"
import gestorRoutes from "./routes/gestorRoutes.js"
import carrinhoRoutes from "./routes/carrinhoRoutes.js"
import carrinhoProductsRoutes from "./routes/carrinho_productsRoutes.js"
import encomendaRoutes from "./routes/encomendaRoutes.js"
import encomendaProductsRoutes from "./routes/encomenda_productsRoutes.js"
import activeStoreSessionRoutes from "./routes/activeStoreSessionRoutes.js"
import storeAuthRoutes from "./routes/storeAuthRoutes.js"

//Configuracao das ligacoes e verificacoes da BD
import pool from "./config/db.js"
import "./middleware/recorrenciaCron.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

//Usar tokens de sessao para cada utilizador
app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: "user_sessions"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // false=http, true=https
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 // durar 1 so dia a cookie da sessao
    }
}));

//Routes para a loja
app.use("/api/products", productRoutes);
app.use("/api/utilizadorCompras", utilizadorComprasRoutes);
app.use("/api/gestor", gestorRoutes);
app.use("/api/carrinho", carrinhoRoutes);
app.use("/api/carrinhoProducts", carrinhoProductsRoutes);
app.use("/api/encomenda", encomendaRoutes);
app.use("/api/encomendaProducts", encomendaProductsRoutes);
app.use("/api/activeStoreSession", activeStoreSessionRoutes);
app.use("/api/store-auth", storeAuthRoutes);

//Routes para o centro
app.use("/api/utilizador", utilizadorRoutes);
app.use("/api/disciplina", disciplinaRoutes);
app.use("/api/explicador", explicadorRoutes);
app.use("/api/explicando", explicandoRoutes);
app.use("/api/pagamento", pagamentoRoutes);
app.use("/api/explicacao", explicacaoRoutes);
app.use("/api/avalFuturas", avaliacoes_futurasRoutes);
app.use("/api/logreg", loginRoutes);
app.use("/api/notas", notasRoutes);
app.use("/api/activeSession", activeSessionRoutes);
app.use("/api/gestorSession", gestorSessionRoutes);

//Funcao que verifica se ha a DB no sistema, caso nao entao vai criar as tabelas necessarias
async function initDB() {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products(
                id_products SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                stock INT DEFAULT 0,
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