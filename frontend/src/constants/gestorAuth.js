import toast from "react-hot-toast";
import apiWithCreds from "./axiosWithCreds.js";
import { create } from "zustand";

export const gestorAuth = create((set,get) => ({
    //Dados de assistencia
    loading: false,
    error: null,
    gestor: null,

    //Lista com todos os dados de uma tabela
    utilizadores: [],
    explicadores: [],
    explicandos: [],
    gestores: [],
    notas: [],
    disciplinas: [],
    avalFuturas: [],
    pagamentos: [],
    explicacoes: [],

    //Dados para criar/editar novo utilizador
    newUtilizador:{
        nome: "",
        email: "",
        telemovel: "",
        tipo: "",
        password: ""
    },
    setNewUtilizador: (newUtilizador) => {set({newUtilizador})},
    resetNewUtilizador: () => {set({newUtilizador:{
        nome: "",
        email: "",
        telemovel: "",
        tipo: "",
        password: ""
    }})},
    
    //Dados para editar utilizador
    editIDutilizador: "",
    setEditIDutilizador: (editIDutilizador) => {set({editIDutilizador})},
    resetEditIDutilizador: () => {set({editIDutilizador: ""})},

    //Dados para criar/editar novo explicador (incluir dados de utilizador na funcao)
    newExplicador:{
        especialidades: "",
        habilitacoes: "",
        valor_hora: "",
        id_utilizador: ""
    },
    setNewExplicador: (newExplicador) => {set({newExplicador})},
    resetNewExplicador: () => {set({newExplicador:{
        especialidades: "",
        habilitacoes: "",
        valor_hora: "",
        id_utilizador: ""
    }})},

    //Dados para editar explicador
    editIDexplicador: "",
    setEditIDexplicador: (editIDexplicador) => {set({editIDexplicador})},
    resetEditIDexplicador: () => {set({editIDexplicador: ""})},

    //Dados para criar/editar novo explicando (incluir dados de utilizador na funcao)
    newExplicando:{
        dificuldades: "",
        ano: "",
        valor_mensalidade: "",
        id_utilizador: ""
    },
    setNewExplicando: (newExplicando) => {set({newExplicando})},
    resetNewExplicando: () => {set({newExplicando:{
        dificuldades: "",
        ano: "",
        valor_mensalidade: "",
        id_utilizador: ""
    }})},

    //Dados para editar explicando
    editIDexplicando: "",
    setEditIDexplicando: (editIDexplicando) => {set({editIDexplicando})},
    resetEditIDexplicando: () => {set({editIDexplicando: ""})},

    //Dados para criar/editar nova explicacao
    newExplicacao:{
        data_inicio: "",
        data_fim: "",
        lecionada: false,
        descricao: "",
        repete_mensal: false,
        origem_recorrencia_id: null,
        id_explicador: "",
        id_disciplina: "",
        id_explicando: ""
    },
    setNewExplicacao: (newExplicacao) => {set({newExplicacao})},
    resetNewExplicacao: () => {set({newExplicacao:{
        data_inicio: "",
        data_fim: "",
        lecionada: false,
        descricao: "",
        repete_mensal: false,
        origem_recorrencia_id: null,
        id_explicador: "",
        id_disciplina: "",
        id_explicando: ""
    }})},

    //Dados de explicacoes recorrentes
    newExplicacaoRecorrente:{
        repete_mensal: false,
        origem_recorrencia_id: ""
    },
    setNewExplicacaoRecorrente: (newExplicacaoRecorrente) => {set({newExplicacaoRecorrente})},
    resetNewExplicacaoRecorrente: () => {set({newExplicacaoRecorrente:{
        repete_mensal: false,
        origem_recorrencia_id: ""
    }})},

    //Dados para editar explicacao
    editIDexplicacao: "",
    setEditIDexplicacao: (editIDexplicacao) => {set({editIDexplicacao})},
    resetEditIDexplicacao: () => {set({editIDexplicacao: ""})},

    //Dados para criar/editar novo pagamento
    newPagamento:{
        tipo: "",
        valor: "",
        is_receita: false,
        data_vencimento: "",
        data_pago: "",
        mes_referencia: null,
        id_utilizador: ""
    },
    setNewPagamento: (newPagamento) => {set({newPagamento})},
    resetNewPagamento: () => {set({newPagamento:{
        tipo: "",
        valor: "",
        is_receita: false,
        data_vencimento: "",
        data_pago: "",
        mes_referencia: null,
        id_utilizador: ""
    }})},

    //Dados para editar pagamento
    editIDpagamento: "",
    setEditIDpagamento: (editIDpagamento) => {set({editIDpagamento})},
    resetEditIDpagamento: () => {set({editIDpagamento: ""})},

    //Dados para criar/editar nova disciplina
    newDisciplina: {
        nome:"",
        ano:"",
        area_cientifica:""
    },
    setNewDisciplina: (newDisciplina) => {set({newDisciplina})},
    resetNewDisciplina: () => {set({newDisciplina: {
        nome:"",
        ano:"",
        area_cientifica:""
    }})},

    //Dados para editar disciplina
    editIDdisciplina: "",
    setEditIDdisciplina: (editIDdisciplina) => {set({editIDdisciplina})},
    resetEditIDdisciplina: () => {set({editIDdisciplina: ""})},

    //Dados para criar/editar novas notas
    newNota: {
        data_avaliacao: "",
        descricao: "",
        valor: "",
        id_disciplina: "",
        id_explicando: ""
    },
    setNewNota: (newNota) => {set({newNota})},
    resetNewNota: () => {set({newNota: {
        data_avaliacao: "",
        descricao: "",
        valor: "",
        id_disciplina: "",
        id_explicando: ""
    }})},

    //Dados para editar nota
    editIDnota: "",
    setEditIDnota: (editIDnota) => {set({editIDnota})},
    resetEditIDnota: () => {set({editIDnota: ""})},

    //Dados para criar/editar novas avaliacoes futuras
    newAvalFutura: {
        data:"",
        descricao:"",
        id_explicando:"",
        id_disciplina:""
    },
    setNewAvalFutura: (newAvalFutura) => {set({newAvalFutura})},
    resetNewAvalFutura: () => {set({newAvalFutura: {
        data:"",
        descricao:"",
        id_explicando:"",
        id_disciplina:""
    }})},

    //Dados para editar avaliacao futura
    editIDAvalFutura: "",
    setEditIDAvalFutura: (editIDAvalFutura) => {set({editIDAvalFutura})},
    resetEditIDAvalFutura: () => {set({editIDAvalFutura: ""})},

    ///////////////////////
    /////Explicador
    ///////////////////////

    //Funcao para criar novo explicador
    createExplicador: async () => {
        set({loading: true, error: null})

        try {
            const {newUtilizador, newExplicador} = get()

            const respUtilizador = await apiWithCreds.post("/api/utilizador/",{
                ...newUtilizador,
                tipo: "explicador"
            })
            await apiWithCreds.post("/api/explicador",{
                ...newExplicador,
                id_utilizador: respUtilizador.data.id_utilizador
            })

            get().resetNewExplicador()
            get().resetNewUtilizador()
            get().getAllExplicadores()
            set({loading: false})
            toast.success("Explicador criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o explicador.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todos os explicadores
    getAllExplicadores: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllExplicadores/")
            set({
                explicadores: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um explicador
    editExplicador: async (id_utilizador,id_explicador) => {
        set({loading: true, error: null})
        try {
            const {newUtilizador, newExplicador} = get()

            if(newUtilizador.password != ""){
                await apiWithCreds.put(`/api/utilizador/${id_utilizador}`,{
                ...newUtilizador,
                tipo: "explicador"
            })
            }else{
                await apiWithCreds.put(`/api/gestorSession/gestorUpdateUtilizador/${id_utilizador}`,{
                ...newUtilizador,
                tipo: "explicador"
            })
            }
            await apiWithCreds.put(`/api/explicador/${id_explicador}`,{
                ...newExplicador,
                id_utilizador: id_utilizador
            })

            get().resetNewExplicador()
            get().resetNewUtilizador()
            get().resetEditIDutilizador()
            get().resetEditIDexplicador()
            get().getAllExplicadores()
            set({loading: false})
            toast.success("Explicador editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o explicador.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um explicador
    deleteExplicador: async  (id_utilizador) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/utilizador/${id_utilizador}`)
            set({loading: false})
            get().getAllExplicadores()
            toast.success("Explicador eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o explicador.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Explicando
    ///////////////////////

    //Funcao para criar novo explicando
    createExplicando: async () => {
        set({loading: true, error: null})

        try {
            const {newUtilizador, newExplicando} = get()

            const respUtilizador = await apiWithCreds.post("/api/utilizador/",{
                ...newUtilizador,
                tipo: "explicando"
            })
            await apiWithCreds.post("/api/explicando",{
                ...newExplicando,
                id_utilizador: respUtilizador.data.id_utilizador
            })

            get().resetNewExplicando()
            get().resetNewUtilizador()
            get().getAllExplicandos()
            set({loading: false})
            toast.success("Explicando criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o explicando.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todos os explicandos
    getAllExplicandos: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllExplicandos/")
            set({
                explicandos: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um explicando
    editExplicando: async (id_utilizador,id_explicando) => {
        set({loading: true, error: null})
        try {
            const {newUtilizador, newExplicando} = get()

            if(newUtilizador.password != ""){
                await apiWithCreds.put(`/api/utilizador/${id_utilizador}`,{
                ...newUtilizador,
                tipo: "explicando"
            })
            }else{
                await apiWithCreds.put(`/api/gestorSession/gestorUpdateUtilizador/${id_utilizador}`,{
                ...newUtilizador,
                tipo: "explicando"
            })
            }
            await apiWithCreds.put(`/api/explicando/${id_explicando}`,{
                ...newExplicando,
                id_utilizador: id_utilizador
            })

            get().resetNewExplicando()
            get().resetNewUtilizador()
            get().resetEditIDutilizador()
            get().resetEditIDexplicando()
            get().getAllExplicandos()
            set({loading: false})
            toast.success("Explicando editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o explicando.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um explicando
    deleteExplicando: async  (id_utilizador) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/utilizador/${id_utilizador}`)
            set({loading: false})
            get().getAllExplicandos()
            toast.success("Explicando eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o explicando.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Gestor
    ///////////////////////

    //Funcao para criar novo gestor
    createGestor: async () => {
        set({loading: true, error: null})

        try {
            const {newUtilizador} = get()

            const respUtilizador = await apiWithCreds.post("/api/utilizador/",{
                ...newUtilizador,
                tipo: "gestor"
            })
            get().resetNewUtilizador()
            get().getAllGestores()
            set({loading: false})
            toast.success("Gestor criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o gestor.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todos os gestores
    getAllGestores: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllGestores/")
            set({
                gestores: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um gestor
    editGestor: async (id_utilizador) => {
        set({loading: true, error: null})
        try {
            const {newUtilizador} = get()

            if(newUtilizador.password != ""){
                await apiWithCreds.put(`/api/utilizador/${id_utilizador}`,newUtilizador)
            }else{
                await apiWithCreds.put(`/api/gestorSession/gestorUpdateUtilizador/${id_utilizador}`,newUtilizador)
            }

            get().resetNewUtilizador()
            get().resetEditIDutilizador()
            get().getAllGestores()
            set({loading: false})
            toast.success("Gestor editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o gestor.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um gestor
    deleteGestor: async  (id_utilizador) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/utilizador/${id_utilizador}`)
            set({loading: false})
            get().getAllGestores()
            toast.success("Gestor eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o gestor.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Notas
    ///////////////////////

    //Funcao para criar nova nota
    createNota: async (id_avalFutura) => {
        set({loading: true, error: null})

        try {
            const {newNota} = get()
            const respNota = await apiWithCreds.post("/api/notas/",newNota)
            get().resetNewNota()
            get().getAllNotas()
            if(id_avalFutura !== -1){
                get().deleteAvalFutura(id_avalFutura)
            }
            set({loading: false})
            toast.success("Nota criada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar a nota.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todas as notas
    getAllNotas: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllNotas/")
            set({
                notas: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar uma nota
    editNota: async (id_nota) => {
        set({loading: true, error: null})
        try {
            const {newNota} = get()

            await apiWithCreds.put(`/api/notas/${id_nota}`,newNota)

            get().resetNewNota()
            get().resetEditIDnota()
            get().getAllNotas()
            set({loading: false})
            toast.success("Nota editada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar a nota.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar uma nota
    deleteNota: async  (id_nota) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/notas/${id_nota}`)
            set({loading: false})
            get().getAllNotas()
            toast.success("Nota eliminada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar a nota.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Disciplinas
    ///////////////////////

    //Funcao para criar nova disciplina
    createDisciplina: async () => {
        set({loading: true, error: null})

        try {
            const {newDisciplina} = get()

            const respDisciplina = await apiWithCreds.post("/api/disciplina/",newDisciplina)
            get().resetNewDisciplina()
            get().getAllDisciplinas()
            set({loading: false})
            toast.success("Disciplina criada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar a disciplina.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todas as disciplinas
    getAllDisciplinas: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/disciplina/")
            set({
                disciplinas: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar uma disciplina
    editDisciplina: async (id_disciplina) => {
        set({loading: true, error: null})
        try {
            const {newDisciplina} = get()

            await apiWithCreds.put(`/api/disciplina/${id_disciplina}`,newDisciplina)

            get().resetNewDisciplina()
            get().resetEditIDdisciplina()
            get().getAllDisciplinas()
            set({loading: false})
            toast.success("Disciplina editada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar a disciplina.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar uma disciplina
    deleteDisciplina: async  (id_disciplina) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/disciplina/${id_disciplina}`)
            set({loading: false})
            get().getAllNotas()
            toast.success("Disciplina eliminada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar a disciplina.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Avaliacoes Futuras
    ///////////////////////

    //Funcao para criar nova avaliacao futura
    createAvalFutura: async () => {
        set({loading: true, error: null})

        try {
            const {newAvalFutura} = get()

            const respDisciplina = await apiWithCreds.post("/api/avalFuturas/",newAvalFutura)
            get().resetNewAvalFutura()
            get().getAllAvalFuturas()
            set({loading: false})
            toast.success("Avaliação futura criada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar a avaliação futura.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todas as avaliacoes futuras
    getAllAvalFuturas: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllAvalFuturas/")
            set({
                avalFuturas: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar uma avaliacao futura
    editAvalFutura: async (id_avaliacoes) => {
        set({loading: true, error: null})
        try {
            const {newAvalFutura} = get()

            await apiWithCreds.put(`/api/avalFuturas/${id_avaliacoes}`,newAvalFutura)

            get().resetNewAvalFutura()
            get().resetEditIDAvalFutura()
            get().getAllAvalFuturas()
            set({loading: false})
            toast.success("Avaliação futura editada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar a avaliação futura.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar uma avaliacao futura
    deleteAvalFutura: async  (id_avaliacoes) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/avalFuturas/${id_avaliacoes}`)
            set({loading: false})
            get().getAllAvalFuturas()
            toast.success("Avaliação futura eliminada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar a avaliação futura.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Pagamentos
    ///////////////////////

    //Funcao para criar novo pagamento
    createPagamento: async () => {
        set({loading: true, error: null})

        try {
            const {newPagamento} = get()

            if(newPagamento.data_pago === ""){
                const limitedPagamento = {
                    tipo: newPagamento.tipo,
                    valor: newPagamento.valor,
                    is_receita: newPagamento.is_receita,
                    data_vencimento: newPagamento.data_vencimento,
                    data_pago: null,
                    id_utilizador: newPagamento.id_utilizador
                }
                await apiWithCreds.post("/api/pagamento/",limitedPagamento)
            }else{
                await apiWithCreds.post("/api/pagamento/",newPagamento)
            }
            get().resetNewPagamento()
            get().getAllPagamentos()
            set({loading: false})
            toast.success("Pagamento criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o pagamento.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todos os pagamentos
    getAllPagamentos: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllPagamentos/")
            set({
                pagamentos: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um pagamento
    editPagamento: async (id_pagamento) => {
        set({loading: true, error: null})
        try {
            const {newPagamento} = get()

            await apiWithCreds.put(`/api/pagamento/${id_pagamento}`,newPagamento)

            get().resetNewPagamento()
            get().resetEditIDpagamento()
            get().getAllPagamentos()
            set({loading: false})
            toast.success("Pagamento editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o pagamento.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um pagamento
    deletePagamento: async  (id_pagamento) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/pagamento/${id_pagamento}`)
            set({loading: false})
            get().getAllPagamentos()
            toast.success("Pagamento eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o pagamento.")
            set({loading: false, error:err})
        }
    },

    //Obter users limitado
    getAllUsersLimit: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllUsersLimit/")
            set({
                utilizadores: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Explicacoes
    ///////////////////////

    //Funcao para criar nova explicacao
    createExplicacao: async () => {
        set({loading: true, error: null})

        try {
            const {newExplicacao} = get()

            await apiWithCreds.post("/api/explicacao/",newExplicacao)
            get().resetNewExplicacao()
            get().getAllExplicacoes()
            set({loading: false})
            toast.success("Explicação criada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar a explicação.")
            set({loading: false, error:err})
        }
    },

    //Funcoes para receber todas as explicacoes
    getAllExplicacoes: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorSession/gestorAllExplicacoes/")
            set({
                explicacoes: resp.data
            })
            set({loading: false})
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar uma explicacao
    editExplicacao: async (id_explicacao) => {
        set({loading: true, error: null})
        try {
            const {newExplicacao} = get()

            await apiWithCreds.put(`/api/explicacao/${id_explicacao}`,newExplicacao)

            get().resetNewExplicacao()
            get().resetEditIDexplicacao()
            get().getAllExplicacoes()
            set({loading: false})
            toast.success("Explicação editada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar a explicação.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar uma explicacao
    deleteExplicacao: async  (id_explicacao) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/explicacao/${id_explicacao}`)
            set({loading: false})
            get().getAllExplicacoes()
            toast.success("Explicação eliminada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar a explicação.")
            set({loading: false, error:err})
        }
    },

    //Funcao para alterar recursividade das explicacoes
    changeExplicRecorrencia: async (exp) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.put(`/api/gestorSession/gestorChangeRecorrencia/${exp.id_explicacao}`,{repete_mensal: !exp.repete_mensal})
            set({loading: false})
            get().getAllExplicacoes()
            toast.success("Explicação tornou-se recorrente a cada mês!")
        } catch (err) {
            toast.error("Algo correu de mal ao mudar a recorrência da explicação.")
            set({loading: false, error:err})
        }
    },

}))