import express from "express"
import { getExplicadorByUtilizador } from "../controllers/explicadorController.js";
import { getExplicandoByUtilizador } from "../controllers/explicandoController.js";
import { getExplicacaoByExplicador, getExplicacaoByExplicando, updateLecionada } from "../controllers/explicacaoController.js";
import { getPagamentosByUser } from "../controllers/pagamentoController.js";

const router = express.Router();

//Verifica se esta alguem com login ativo
router.get("/activeUser", (req,res) =>{
    //Se nao houver nenhuma sessao de login ativa, nao retorna nada
    if(!req.session.user){
        return res.status(401).json({auth:false});
    }

    //Se houver, retorna os dados do utilizador 
    return res.status(200).json({
        auth: true,
        user: req.session.user
    })
})

//Obter explicador pelo id do utilizador da sessao
router.get("/explicadorFromUser/:id_utilizador", getExplicadorByUtilizador)

//Obter explicando pelo id do utilizador da sessao
router.get("/explicandoFromUser/:id_utilizador", getExplicandoByUtilizador)

//Obter explicacoes pelo id do utilizador da sessao
router.get("/explicacoesExplicador/:id_explicador",getExplicacaoByExplicador)
router.get("/explicacoesExplicando/:id_explicando",getExplicacaoByExplicando)

//Mudar o estado de lecionado da explicacao
router.put("/editLecionada/:id_explicacao",updateLecionada)

//Receber pagamentos pelo id do utilizador
router.get("/pagamentosUserID/:id_utilizador", getPagamentosByUser)

export default router;