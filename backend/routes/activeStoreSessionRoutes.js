import express from "express"
import { getGestorByUserID } from "../controllers/gestorController.js";

const router = express.Router();

//Verifica se esta alguem com login de loja ativo nessa sessao
router.get("/activeStoreUser", (req,res) => {
    //Se nao houver nenhuma sessao de login ativa, nao retorna nada
    if(!req.session.userStore){
        return res.status(401).json({auth:false});
    }

    //Se houver, retorna os dados do utilizador 
    return res.status(200).json({
        auth: true,
        userStore: req.session.userStore
    })
})

//Verificar se o utilizador da loja e um gestor
router.get("/getGestorByUserID/:id", getGestorByUserID)

export default router;