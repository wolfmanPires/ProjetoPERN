import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import apiWithCreds from "./axiosWithCreds.js";

export const useProduct = create((set, get) => ({
    //Estado dos produtos
    products:[],
    loading: false,
    error:null,
    currProduct: null,

    //Formulario e funcoes para criar um novo produto
    formData: {
        name: "",
        price:"",
        image:"", 
        stock:"",
        description:""
    },
    setFormData: (formData) => {set({formData})},
    resetFormData: () => {set({formData: {
        name: "",
        price:"",
        image:"", 
        stock:"",
        description:""
    }})},

    addProduct: async (e) => {
        e.preventDefault(); //Impede a pagina de refrescar, permitindo usar dados do formulario 
        set({loading: true});
        try {
            const {formData} = get()
            await apiWithCreds.post(`/api/products`, formData);
            await get().fetchProducts();
            get().resetFormData();
            toast.success("Produto adicionado com sucesso!")
            //Fechar Modal
            document.getElementById("addProductModal").close();
        } catch (err) {
            toast.error("Algo correu de mal ao criar o novo produto.")
        } finally {
            set({loading:false})
        }
    },

    fetchProducts: async () => {
        set({loading:true});
        try{
            const resp = await apiWithCreds.get(`/api/products`);
            set({products: resp.data, error:null});
        }catch(err){
            set({error: "Erro ao resgatar produto, por favor contacte um técnico."})
        }finally{
            set({loading:false});
        }
    },

    deleteProduct: async (id) => {
        set({loading:true});
        try {
            await apiWithCreds.delete(`/api/products/${id}`);
            set(prev => ({products: prev.products.filter(product => product.id !== id)})); {/* Filtra fora da cache o produto apagado (poupando dados do refresh) */}
            toast.success("Produto apagado com sucesso!")
        } catch (err) {
            toast.error("Ocorreu um erro ao apagar, por favor tente outra vez mais tarde.")
        } finally {
            set({loading: false});
        }
    },

    fetchProduct: async (id) => {
        set({loading:true});
        try{
            const resp = await apiWithCreds.get(`/api/products/${id}`);
            const cleanForm = {
                name: resp.data[0].name,
                price: resp.data[0].price,
                image: resp.data[0].image, 
                stock: resp.data[0].stock,
                description: resp.data[0].description
            };
            set({currProduct: resp.data, error:null, formData: cleanForm});
        }catch(err){
            set({error: "Erro ao resgatar produto, por favor contacte um técnico."})
        }finally{
            set({loading:false});
        }
    },

    updateProduct: async (id) => {
        //e.preventDefault(); 
        set({loading: true});
        try {
            const {formData} = get()
            const resp = await apiWithCreds.put(`/api/products/${id}`, formData);
            set({currProduct: resp.data})
            toast.success("Produto editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o produto.")
        } finally {
            set({loading:false})
        }
    },
}))