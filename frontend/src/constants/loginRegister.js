import apiWithCreds from "./axiosWithCreds.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const doLogin = create((set, get) => ({
    //Dados de assistencia
    loading: false,
    error: null,
    user:null,
    storeUser:null,

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

    //Formulario de login da loja
    storeFormData:{
        email:"",
        password:""
    },
    setStoreFormData: (storeFormData) => {set({storeFormData})},
    resetStoreFormData: () => {set({storeFormData:{
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
            set({error: err})
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
            get().resetStoreFormData()
            set({loading: false, error: null, user:null, storeUser:null})
        } catch (err) {
            set({error: err, loading: false})
        }
    },

    //Trata do login do utilizador da loja
    verificaPassStore: async (e) => {
        e.preventDefault(); //Impede a pagina de refrescar, permitindo usar dados do formulario 
        set({loading: true});
        try {
            const {storeFormData} = get();
            const response = await apiWithCreds.post("/api/logreg/loginStore",storeFormData);
            get().resetStoreFormData();
            set({storeUser:response.data.user})
            toast.success(`Bem vindo ${response.data.user.nome}!`)
            return response.data.user;
        } catch (err) {
            set({error: err})
            toast.error("Dados incorretos, por favor tente de novo.")
            return false;
        }finally{
            set({loading: false})
        }
    },
}));