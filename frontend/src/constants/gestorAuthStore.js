import toast from "react-hot-toast";
import apiWithCreds from "./axiosWithCreds.js";
import { create } from "zustand";

export const gestorAuthStore = create((set,get) => ({
    //Dados de assistencia
    loading: false,
    error: null,
    gestor: null,

    //Lista com todos os dados de uma tabela
    clientes: [],
    gestores: [],
    encomendas: [],
    carrinhos: [],
    produtos: [],
    dashboard: {
        totalProdutos: 0,
        totalClientes: 0,
        totalEncomendas: 0,
        receitaTotal: 0,
        encomendasPendentes: 0,
        ultimasEncomendas: [],
        stockBaixo: [],
        produtosMaisVendidos: []
    },

    //Lista com dados especificos de uma tabela mista
    encomendaProdutos: [],
    carrinhoPodutos: [],

    //Dados para criar/editar novo cliente
    newCliente:{
        nome: "",
        email: "",
        telemovel: "",
        password:""
    },
    setNewCliente: (newCliente) => {set({newCliente})},
    resetNewCliente: () =>  {set({newCliente:{
        nome: "",
        email: "",
        telemovel: "",
        password:""
    }})},

    editIDcliente: "",
    setEditIDcliente: (editIDcliente) => {set({editIDcliente})},
    resetEditIDcliente: () => {set({editIDcliente: ""})},

    //Dados para criar/editar novo gestor
    newGestor:{
        id_utilizador_compras: ""
    },
    setNewGestor: (newGestor) => {set({newGestor})},
    resetNewGestor: () =>  {set({newGestor:{
        id_utilizador_compras: ""
    }})},

    editIDgestor: "",
    setEditIDgestor: (editIDgestor) => {set({editIDgestor})},
    resetEditIDgestor: () => {set({editIDgestor: ""})},

    //Dados para criar/editar novas encomendas
    newEncomenda:{
        estado: "",
        total: "",
        data_encomenda: "",
        estado_pagamento: "",
        data_pagamento: "",
        observacoes: "",
        id_utilizador_compras: ""
    },
    setNewEncomenda: (newEncomenda) => {set({newEncomenda})},
    resetNewEncomenda: () =>  {set({newEncomenda:{
        estado: "",
        total: "",
        data_encomenda: "",
        estado_pagamento: "",
        data_pagamento: "",
        observacoes: "",
        id_utilizador_compras: ""
    }})},

    editIDencomenda: "",
    setEditIDencomenda: (editIDencomenda) => {set({editIDencomenda})},
    resetEditIDencomenda: () => {set({editIDencomenda: ""})},

    //Dados para criar/editar novos carrinhos
    newCarrinho:{
        id_utilizador_compras: ""
    },
    setNewCarrinho: (newCarrinho) => {set({newCarrinho})},
    resetNewCarrinho: () =>  {set({newCarrinho:{
        id_utilizador_compras: ""
    }})},

    editIDcarrinho: "",
    setEditIDcarrinho: (editIDcarrinho) => {set({editIDcarrinho})},
    resetEditIDcarrinho: () => {set({editIDcarrinho: ""})},

    //Dados para criar/editar novos produtos
    newProduct:{
        name: "",
        description: "",
        image: "",
        price: "",
        stock: ""
    },
    setNewProduct: (newProduct) => {set({newProduct})},
    resetNewProduct: () =>  {set({newProduct:{
        name: "",
        description: "",
        image: "",
        price: "",
        stock: ""
    }})},

    editIDproduto: "",
    setEditIDproduto: (editIDproduto) => {set({editIDproduto})},
    resetEditIDproduto: () => {set({editIDproduto: ""})},

    //Dados para criar/editar novos encomenda/produtos
    newEncomendaProduct:{
        id_encomenda: "",
        id_products: "",
        quantidade: "",
        preco_unitario: ""
    },
    setNewEncomendaProduct: (newEncomendaProduct) => {set({newEncomendaProduct})},
    resetNewEncomendaProduct: () =>  {set({newEncomendaProduct:{
        id_encomenda: "",
        id_products: "",
        quantidade: "",
        preco_unitario: ""
    }})},

    //Dados para criar/editar novos carrinho/produtos
    newCarrinhoProduct:{
        id_carrinho: "",
        id_products: "",
        quantidade: ""
    },
    setNewCarrinhoProduct: (newCarrinhoProduct) => {set({newCarrinhoProduct})},
    resetNewCarrinhoProduct: () =>  {set({newCarrinhoProduct:{
        id_carrinho: "",
        id_products: "",
        quantidade: ""
    }})},

    ///////////////////////
    /////Clientes
    ///////////////////////

    //Funcao para criar novo cliente
    createCliente: async () => {
        set({loading: true, error: null})

        try {
            const {newCliente} = get()
            const respCliente = await apiWithCreds.post("/api/utilizadorCompras/",newCliente)
            get().resetNewCliente()
            get().getAllClientes()
            set({loading: false})
            toast.success("Utilizador criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o utilizador.")
            set({loading: false, error:err})
        }
    },

    //Funcao para criar novo gestor
    createGestor: async () => {
        set({loading: true, error: null})

        try {
            const {newCliente} = get()
            const respCliente = await apiWithCreds.post("/api/utilizadorCompras/",newCliente)
            const respGestor = await apiWithCreds.post("/api/gestor/",{
                id_utilizador_compras: respCliente.data.id_utilizador_compras
            })

            get().resetNewCliente()
            get().getAllClientes()
            set({loading: false})
            toast.success("Gestor criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o gestor.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todos os clientes
    getAllClientes: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorStoreSession/getUtilizadorGestor/")
            set({
                clientes: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um cliente
    editCliente: async (id_utilizador_compras) => {
        set({loading: true, error: null})
        try {
            const {newCliente} = get()

            if(newCliente.password != ""){
                await apiWithCreds.put(`/api/utilizadorCompras/${id_utilizador_compras}`,newCliente)
            }else{
                await apiWithCreds.put(`/api/gestorStoreSession/gestorUpdateUtilizadorComprasPasswordless/${id_utilizador_compras}`,newCliente)
            }

            get().resetNewCliente()
            get().resetEditIDcliente()
            get().getAllClientes()
            set({loading: false})
            toast.success("Utilizador editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o utilizador.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um cliente
    deleteCliente: async  (id_utilizador_compras) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/utilizadorCompras/${id_utilizador_compras}`)
            set({loading: false})
            get().getAllClientes()
            toast.success("Utilizador eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o utilizador.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Encomendas
    ///////////////////////

    //Funcao para criar nova encomenda
    createEncomenda: async () => {
        set({loading: true, error: null})

        try {
            const {newEncomenda} = get()
            const resp = await apiWithCreds.post("/api/encomenda/",newEncomenda)
            get().resetNewEncomenda()
            get().getAllEncomendas()
            set({loading: false})
            toast.success("Encomenda criada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar a encomenda.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todas as encomendas
    getAllEncomendas: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/gestorStoreSession/getAllEncomendasWithUsers")
            set({
                encomendas: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar uma encomenda
    editEncomenda: async (id_encomenda) => {
        set({loading: true, error: null})
        try {
            const {newEncomenda} = get()

            await apiWithCreds.put(`/api/encomenda/${id_encomenda}`,newEncomenda)

            get().resetNewEncomenda()
            get().resetEditIDencomenda()
            get().getAllEncomendas()
            set({loading: false})
            toast.success("Encomenda editada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar a encomenda.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar uma encomenda
    deleteEncomenda: async  (id_encomenda) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/encomenda/${id_encomenda}`)
            set({loading: false})
            get().getAllEncomendas()
            toast.success("Encomenda eliminada com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar a encomenda.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Produtos
    ///////////////////////

    //Funcao para criar novo produto
    createProduto: async () => {
        set({loading: true, error: null})

        try {
            const {newProduct} = get()
            const respCliente = await apiWithCreds.post("/api/products/",newProduct)
            get().resetNewProduct()
            get().getAllProdutos()
            set({loading: false})
            toast.success("Produto criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o produto.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todos os produtos
    getAllProdutos: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/products/")
            set({
                produtos: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um produto
    editProduto: async (id_products) => {
        set({loading: true, error: null})
        try {
            const {newProduct} = get()

            await apiWithCreds.put(`/api/products/${id_products}`,newProduct)

            get().resetNewProduct()
            get().resetEditIDproduto()
            get().getAllProdutos()
            set({loading: false})
            toast.success("Produto editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o produto.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um produto
    deleteProduto: async  (id_products) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/products/${id_products}`)
            set({loading: false})
            get().getAllProdutos()
            toast.success("Produto eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o produto.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////Carrinhos
    ///////////////////////

    //Funcao para criar novo carrinho
    createCarrinho: async () => {
        set({loading: true, error: null})

        try {
            const {newCarrinho} = get()
            const respCliente = await apiWithCreds.post("/api/carrinho/",newCarrinho)
            get().resetNewCarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todos os carrinhos
    getAllCarrinhos: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/carrinho/")
            set({
                carrinhos: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um carrinho
    editCarrinho: async (id_carrinho) => {
        set({loading: true, error: null})
        try {
            const {newCarrinho} = get()

            await apiWithCreds.put(`/api/carrinho/${id_carrinho}`,newCarrinho)

            get().resetNewCarrinho()
            get().resetEditIDcarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um carrinho
    deleteCarrinho: async  (id_carrinho) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/carrinho/${id_carrinho}`)
            set({loading: false})
            get().getAllCarrinhos()
            toast.success("Carrinho eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o carrinho.")
            set({loading: false, error:err})
        }
    },


    ///////////////////////
    /////CarrinhoProdutos
    ///////////////////////

    //Funcao para criar novo produto num carrinho
    createCarrinhoProduto: async () => {
        set({loading: true, error: null})

        try {
            const {newCarrinho} = get()
            const respCliente = await apiWithCreds.post("/api/carrinho/",newCarrinho)
            get().resetNewCarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todos os produtos de um carrinho
    getAllProdutosOfCarrinho: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/carrinho/")
            set({
                carrinhos: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um um produto de um carrinho
    editCarrinhoProduto: async (id_carrinho) => {
        set({loading: true, error: null})
        try {
            const {newCarrinho} = get()

            await apiWithCreds.put(`/api/carrinho/${id_carrinho}`,newCarrinho)

            get().resetNewCarrinho()
            get().resetEditIDcarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um produto de um carrinho
    deleteCarrinhoProduto: async  (id_carrinho) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/carrinho/${id_carrinho}`)
            set({loading: false})
            get().getAllCarrinhos()
            toast.success("Carrinho eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o carrinho.")
            set({loading: false, error:err})
        }
    },

    ///////////////////////
    /////EncomendaProdutos
    ///////////////////////

    //Funcao para criar novo produto numa encomenda
    createEncomendaProduto: async () => {
        set({loading: true, error: null})

        try {
            const {newCarrinho} = get()
            const respCliente = await apiWithCreds.post("/api/carrinho/",newCarrinho)
            get().resetNewCarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho criado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao criar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para receber todos os produtos de uma encomenda
    getAllProdutosOfEncomenda: async () => {
        set({loading: true, error: null})

        try {
            const resp = await apiWithCreds.get("/api/carrinho/")
            set({
                carrinhos: resp.data,
                loading: false
            })
        } catch (err) {
            set({loading: false, error:err})
        }
    },

    //Funcao para editar um um produto de uma encomenda
    editEncomendaProduto: async (id_carrinho) => {
        set({loading: true, error: null})
        try {
            const {newCarrinho} = get()

            await apiWithCreds.put(`/api/carrinho/${id_carrinho}`,newCarrinho)

            get().resetNewCarrinho()
            get().resetEditIDcarrinho()
            get().getAllCarrinhos()
            set({loading: false})
            toast.success("Carrinho editado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao editar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para apagar um produto de uma encomenda
    deleteEncomendaProduto: async  (id_carrinho) => {
        set({loading: true, error: null})
        try {
            await apiWithCreds.delete(`/api/carrinho/${id_carrinho}`)
            set({loading: false})
            get().getAllCarrinhos()
            toast.success("Carrinho eliminado com sucesso!")
        } catch (err) {
            toast.error("Algo correu de mal ao eliminar o carrinho.")
            set({loading: false, error:err})
        }
    },

    //Funcao para obter dados gerais
    getDashboard: async () => {
        set({loading: true,error: null});

        try {
            const resp = await apiWithCreds.get("/api/store-auth/obterDashboard");

            set({dashboard: resp.data, loading: false});

            return resp.data;
        } catch (err) {
            console.error("Erro ao receber dashboard:",err);

            set({
                loading: false,
                error:err.response?.data?.message ||"Erro ao obter os dados da dashboard."
            });

            return null;
        }
    },

}))