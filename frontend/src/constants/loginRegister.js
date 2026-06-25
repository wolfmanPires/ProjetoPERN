import apiWithCreds from "./axiosWithCreds.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const doLogin = create((set, get) => ({
    //Dados de assistencia
    loading: false,
    error: null,
    user:null,

    //Formulario de login e funcoes para tratar dele
    formData:{
        email:"",
        password:""
    },
    setFormData: (formData) => {set({formData})},
    resetFormData: () => {set({formData:{
        email:"",
        password:""
    }})},

    //Trata do login do utilizador
    verificaPass: async (e) => {
        e.preventDefault(); //Impede a pagina de refrescar, permitindo usar dados do formulario 
        set({loading: true});
        try {
            const {formData} = get();
            const response = await apiWithCreds.post("/api/logreg/login",formData);
            get().resetFormData();
            set({user:response.data.user})
            toast.success(`Bem vindo ${response.data.user.nome}!`)
            return response.data.user;
        } catch (err) {
            console.log("Erro ao dar login", err)
            toast.error("Dados incorretos, por favor tente de novo.")
            return false;
        }finally{
            set({loading: false})
        }
    },

    //Trata do logout do utilizador
    logout: async () => {
        set({loading: true});
        try {
            await apiWithCreds.post("/api/logreg/logout")
            get().resetFormData()
            set({loading: false, error: null, user:null})
        } catch (err) {
            console.error("Erro ao terminar sessão: ",err)
            set({loading: false})
        }
    }
}));