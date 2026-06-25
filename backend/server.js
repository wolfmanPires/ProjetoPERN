
//Imports dos pactos de dependencias
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
import pool from "./config/db.js"

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

app.use("/api/products", productRoutes);
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