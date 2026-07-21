import apiWithCreds from "./axiosWithCreds.js";
import { create } from "zustand";

export const useAuth = create((set, get) => ({
    //Dados de assistencia
    loading: false,
    error:  null,
    user:   null,
    explicando: null,
    avalFuturasData: [],
    notasData: [],
    explicData: [],
    extraData: {
        especialidades: "",
        habilitacoes: "",
        dificuldades: ""
    },
    pagamentosData: [],
    specificExplic: {
        data_inicio: "",
        data_fim: "",
        lecionada: false,
        descricao: "",
        id_explicador: "",
        id_disciplina: "",
        id_explicando: "",
    },
    resetSpecificExplic: () => {set({specificExplic: {
        data_inicio: "",
        data_fim: "",
        lecionada: false,
        descricao: "",
        id_explicador: "",
        id_disciplina: "",
        id_explicando: "",
    }})},
    setSpecificExplic: (specificExplic) => {set({specificExplic})},
    currSpecificExplic: null,

    //Procurar se existe um utilizador na sessao
    checkUser: async () => {
        set({loading: true, error:null})

        try {
            const resp = await apiWithCreds.get("/api/activeSession/activeUser");
            set({
                user: resp.data.user, 
                loading:false
            })
            return resp.data.user;
        } catch (err) {
            set({
                user: null,
                loading: false,
                error: err.response?.data?.message || "Sessão não encontrada"
            })
            return null;
        }
    },

    //Obtem todas as explicacoes de um utilizador
    checkExplicacoes: async () => {
        set({loading:true, error:null})

        try{
            const {user} = get()
            if (user.tipo === "explicador"){
                const respExplicID = await apiWithCreds.get(`/api/activeSession/explicadorFromUser/${user.id_utilizador}`)
                const respAllExp = await apiWithCreds.get(`/api/activeSession/explicacoesExplicador/${respExplicID.data[0].id_explicador}`)
                set({
                    explicData: respAllExp.data,
                    loading: false
                })
                return respAllExp.data;
            }else if (user.tipo === "explicando"){
                const respExplicID = await apiWithCreds.get(`/api/activeSession/explicandoFromUser/${user.id_utilizador}`)
                const respAllExp = await apiWithCreds.get(`/api/activeSession/explicacoesExplicando/${respExplicID.data[0].id_explicando}`)
                set({
                    explicData: respAllExp.data,
                    loading: false
                })
                return respAllExp.data;
            }
        } catch (err) {
            set({
                explicData: [],
                loading: false,
                error: err.response?.data?.message || "Explicações não encontradas"
            })
            return null;
        }
    },

    //Muda o estado de lecionado de uma dada explicacao
    toggleLecionada: async (id_explicacao,lecionada) => {
        set({loading:true, error:null})

        try {
            const {user} = get()
            if (user.tipo === "explicador"){
                const resp = await apiWithCreds.put(`/api/activeSession/editLecionada/${id_explicacao}`,{lecionada: lecionada})
                set(state => ({
                    explicData: state.explicData.map(
                        exp => exp.id_explicacao===id_explicacao ? resp.data : exp)
                }))
                get().getSingleExplicacao(id_explicacao)
            }
            set({loading:false})
        } catch (err) {
            set({
                explicData: [],
                loading: false,
                error: err.response?.data?.message || "Explicações não encontradas"
            })
            return null;
        }
    },


    getProfileData: async () => {
        set({loading:true, error:null})

        try {
            const {user, extraData} = get()
            
            if(user.tipo === "explicador"){
                const respExtra = await apiWithCreds.get(`/api/activeSession/explicadorFromUser/${user.id_utilizador}`)
                set({
                    extraData: {
                        especialidades: respExtra.data[0].especialidades,
                        habilitacoes: respExtra.data[0].habilitacoes,
                        dificuldades: ""
                    },
                    loading: false
                })
                return respExtra.data;
            }else if(user.tipo === "explicando"){
                const respExtra = await apiWithCreds.get(`/api/activeSession/explicandoFromUser/${user.id_utilizador}`)
                set({
                    extraData: {
                        especialidades: "",
                        habilitacoes: "",
                        dificuldades: respExtra.data[0].dificuldades
                    },
                    loading: false
                })
                return respExtra.data;
            }
        } catch (err) {
            set({
                user: null,
                extraData: {
                    especialidades: "",
                    habilitacoes: "",
                    dificuldades: ""
                },
                loading: false,
                error: err.response?.data?.message || "Utilizador não encontrado"
            })
            return null;
        }
    },

    getPagamentosData: async () => {
        set({loading:true, error:null})

        try {
            const {user, pagamentosData} = get()

            const resp = await apiWithCreds.get(`/api/activeSession/pagamentosUserID/${user.id_utilizador}`)
            set({
                loading: false,
                pagamentosData: resp.data
            })
            return resp.data;
        } catch (err) {
            set({
                user: null,
                pagamentosData: [],
                loading: false,
                error: err.response?.data?.message || "Pagamentos não encontrados"
            })
            return null;
        }
    },

    getSingleExplicacao: async (id) => {
        set({loading:true, error: null})

        try {
            const resp = await apiWithCreds.get(`/api/explicacao/${id}`)
            const cleanForm = {
                data_inicio: resp.data[0].data_inicio,
                data_fim: resp.data[0].data_fim,
                lecionada: resp.data[0].lecionada,
                descricao: resp.data[0].descricao,
                id_explicador: resp.data[0].id_explicador,
                id_disciplina: resp.data[0].id_disciplina,
                id_explicando: resp.data[0].id_explicando
            }
            set({currSpecificExplic: resp.data, specificExplic: cleanForm, loading: false})
        } catch (err) {
            set({
                error: err.response?.data?.message || "Erro ao obter explicação", loading: false
            })
        }
    },

    editExplicacao: async (id) => {
        set({loading:true, error: null})

        try {
            const {specificExplic} = get()
            const resp = await apiWithCreds.put(`/api/explicacao/${id}`, specificExplic)
            set({currSpecificExplic: resp.data, loading: false})
            get().resetSpecificExplic()
            toast.success("Explicação alterada com sucesso!")
            return resp.data
        } catch (err) {
            set({
                error: err.response?.data?.message || "Erro ao editar explicação", loading: false
            })
            return null
        }
    },

    //Explicador pode ver todas as avaliacoes futuras dos explicandos com que ele tem explicacoes com
    getAvalFuturasExplicador: async () => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const respExtra = await apiWithCreds.get(`/api/activeSession/explicadorFromUser/${user.id_utilizador}`)
            const resp = await apiWithCreds.get(`/api/activeSession/getAllAvalFuturasOfExplicador/${respExtra.data[0].id_explicador}`)
            set({
                avalFuturasData: resp.data,
                loading: false
            })
            return resp.data
        } catch (err) {
            set({
                avalFuturasData: [],
                error: err.response?.data?.message || "Erro ao receber avaliações futuras dos explicandos", loading: false
            })
            return null
        }
    },

    //Explicando pode ver suas avaliacoes futuras 
    getAvalFuturasExplicando: async () => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const resp = await apiWithCreds.get(`/api/activeSession/getAllAvalFuturasOfExplicando/${user.id_utilizador}`)
            set({
                avalFuturasData: resp.data,
                loading: false
            })
            return resp.data
        } catch (err) {
            set({
                avalFuturasData: [],
                error: err.response?.data?.message || "Erro ao receber avaliações futuras dos explicandos", loading: false
            })
            return null
        }
    },

    //receber dados de explicando
    getExplicandoFromUser: async () => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const resp = await apiWithCreds.get(`/api/activeSession/explicandoFromUser/${user.id_utilizador}`)
            set({
                explicando: resp.data[0],
                loading: false
            })
            return resp.data[0]
        } catch (err) {
            set({
                avalFuturasData: [],
                error: err.response?.data?.message || "Erro ao receber avaliações futuras dos explicandos", loading: false
            })
            return null
        }
    },

    //Explicador pode ver todas as notas dos explicandos com que ele tem explicacoes com
    getNotasExplicador: async () => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const respExtra = await apiWithCreds.get(`/api/activeSession/explicadorFromUser/${user.id_utilizador}`)
            const resp = await apiWithCreds.get(`/api/activeSession/getAllNotasOfExplicador/${respExtra.data[0].id_explicador}`)
            set({
                notasData: resp.data,
                loading: false
            })
            return resp.data
        } catch (err) {
            set({
                notasData: [],
                error: err.response?.data?.message || "Erro ao receber notas dos explicandos", loading: false
            })
            return null
        }
    },

    //Explicando pode ver suas notas
    getNotasExplicando: async () => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const resp = await apiWithCreds.get(`/api/activeSession/getAllNotasOfExplicando/${user.id_utilizador}`)
            set({
                notasData: resp.data,
                loading: false
            })
            return resp.data
        } catch (err) {
            set({
                notasData: [],
                error: err.response?.data?.message || "Erro ao receber notas dos explicandos", loading: false
            })
            return null
        }
    },

    //Alterar dados de utilizador
    updateProfile: async (formData) => {
        set({loading:true, error: null})

        try {
            const {user} = get()
            const respUser = await apiWithCreds.put(`/api/utilizador/${user.id_utilizador}`,formData)
            if(user.tipo === "explicador"){
                const respExplic = await apiWithCreds.put(`/api/activeSession/updateExplicadorByUserID/${user.id_utilizador}`,formData)
            }else if(user.tipo === "explicando"){
                const respExplic = await apiWithCreds.put(`/api/activeSession/updateExplicandoByUserID/${user.id_utilizador}`,formData)
            }
            set({
                loading: false
            })
            return respUser
        } catch (err) {
            set({
                error: err.response?.data?.message || "Erro ao receber notas dos explicandos", loading: false
            })
            return null
        }
    }
}))