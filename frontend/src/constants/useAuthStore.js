import apiWithCreds from "./axiosWithCreds.js";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
    //Dados de assistencia
    loading: false,
    error:  null,
    userStore:   null,
    gestor: null,
    carrinho: null,
    carrinhoProducts: [],
    specificProduto: null,
    singleEncomenda: null,
    encomendaProducts: [],
    encomendas: [],
    
    //Limpar a sessao no logout
    clearStoreSession: () => {
        set({
            loading: false,
            error:  null,
            userStore:   null,
            gestor: null,
            carrinho: null,
            carrinhoProducts: [],
            specificProduto: null,     
            encomendaProducts: [],
            encomendas: [],
        })
    },

    //Procurar se existe um utilizador da loja na sessao
    checkUserStore: async () => {
        set({loading: true, error:null})

        try {
            const resp = await apiWithCreds.get("/api/activeStoreSession/activeStoreUser");
            set({
                userStore: resp.data.userStore, 
                loading:false
            })
            return resp.data.userStore;
        } catch (err) {
            set({
                userStore: null,
                loading: false,
                error: err.response?.data?.message || "Sessão não encontrada"
            })
            return null;
        }
    },


    //Funcao para verificar se o user e gestor
    checkGestor: async () => {
        set({loading: true, error:null, gestor: null})

        try {
            const {userStore} = get()
            const resp = await apiWithCreds.get(`/api/activeStoreSession/getGestorByUserID/${userStore.id_utilizador_compras}`);
            set({
                gestor: resp, 
                loading:false
            })
            return resp;
        } catch (err) {
            set({
                gestor: null,
                loading: false,
                error: err.response?.data?.message || "Sessão não encontrada"
            })
            return null;
        }
    },

    //Obter carrinho do utilizador
    getCarrinho: async () => {
        set({loading: true, error:null})

        try {
            const {userStore} = get()
            const resp = await apiWithCreds.get(`/api/carrinhoProducts/getCarrinhoFromUserCompraID/${userStore.id_utilizador_compras}`)
            if(resp.data.length == 0){
                await get().addCarrinho(userStore.id_utilizador_compras)
                return resp.data;
            }else{
                set({
                    carrinho: resp.data[0],
                    loading: false
                })
                return resp.data[0];
            }
        } catch (err) {
            set({
                carrinho: null,
                loading: false,
                error: err.response?.data?.message || "Carrinho não encontrado"
            })
            return null;
        }
    },

    //Obter produtos dentro de um carrinho
    getProdutosCarrinho: async () => {
        set({loading: true, error:null})

        try {
            const {carrinho} = get()
            const resp = await apiWithCreds.get(`/api/carrinhoProducts/getAllProductsFromCarrinho/${carrinho.id_carrinho}`)
            set({
                carrinhoProducts: resp.data,
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                carrinhoProducts: [],
                loading: false,
                error: err.response?.data?.message || "Produtos do carrinho não encontrados"
            })
            return null;
        }
    },

    //Obter produto especifico de base de dados
    getSpecificProdutoCarrinho: async (id_products) => {
        set({loading: true, error:null})

        try {
            const {carrinho} = get()
            const resp = await apiWithCreds.get(`/api/carrinhoProducts/getCarrinhoProdutoFromBothID/${carrinho.id_carrinho}/${id_products}`)
            const produtoEncontrado = resp.data[0] ?? null
            set({
                specificProduto: produtoEncontrado,
                loading: false
            })
            return produtoEncontrado;
        } catch (err) {
            set({
                specificProduto: null,
                loading: false,
                error: err.response?.data?.message || "Produtos do carrinho não encontrados"
            })
            return null;
        }
    },

    //Limpar area do produto especifico
    cleanSpecificProduto: () => {
        set({specificProduto: null})
    },

    //Funcao para criar carrinho
    addCarrinho: async (id_utilizador_compras) => {
        set({loading: true, error:null})

        try {
            const resp = await apiWithCreds.post(`/api/carrinho/`,{
                id_utilizador_compras: id_utilizador_compras
            })
            set({
                carrinho: resp.data,
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                carrinho: null,
                loading: false,
                error: err.response?.data?.message || "Erro ao criar carrinho"
            })
            return null;
        }
    },

    //Funcao para criar produto dentro do carrinho
    addProductToCarrinho: async (id_products) => {
        set({loading: true, error:null})

        try {
            const {carrinho} = get()
            const resp = await apiWithCreds.post(`/api/carrinhoProducts/`,{
                quantidade: 1,
                id_carrinho: carrinho.id_carrinho,
                id_products: id_products
            })
            await get().getProdutosCarrinho()
            set({
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Produto não adicionado ao carrinho"
            })
            return null;
        }
    },

    //Funcao para apagar produto no carrinho
    deleteProductToCarrinho: async (id_products) => {
        set({loading: true, error:null})

        try {
            const {carrinho} = get()
            const resp = await apiWithCreds.delete(`/api/carrinhoProducts/deleteSingleProduct`,{
                data: {
                    id_carrinho: carrinho.id_carrinho,
                    id_products: id_products
                }
            })
            await get().getProdutosCarrinho()
            set({
                specificProduto: null,
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Produto não apagado do carrinho"
            })
            return null;
        }
    },

    //Funcao para mudar quantidade produto no carrinho
    changeQuantProductToCarrinho: async (quantidade,id_products) => {
        set({loading: true, error:null})

        if(Number(quantidade) == 0){
            return await get().deleteProductToCarrinho(id_products)
        }

        try {
            const {carrinho} = get()
            const resp = await apiWithCreds.put(`/api/carrinhoProducts/`,{
                quantidade: quantidade,
                id_carrinho: carrinho.id_carrinho,
                id_products: id_products
            })
            await get().getProdutosCarrinho()
            set({
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Produto não alterado no carrinho"
            })
            return null;
        }
    },

    //Limpa o carrinho todo
    clearCarrinho: async () => {
        set({ loading: true, error: null })

        try {
            const { carrinho, carrinhoProducts } = get()

            const resp = await apiWithCreds.delete(`/api/carrinhoProducts/deleteAllProducts/${carrinho.id_carrinho}`)

            set({
                carrinhoProducts: [],
                loading: false
            })

            return true
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Não foi possível limpar o carrinho"
            })
            return false;
        }
    },

    //Funcao para processar pagamento e criacao da encomenda caso esta tenha sucesso
    doPagamentoFromCarrinho: async (dadosEnvio) => {
        set({ loading: true, error: null })

        try {
            const {carrinho} = get()
            const response = await apiWithCreds.post("/api/encomenda/createEncomendaFromCarrinho",
                {id_carrinho: carrinho.id_carrinho, observacoes: dadosEnvio.observacoes.trim()});
            
            set({
                loading: false
            })

            return response
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Não foi possível criar a encomenda"
            })
            return null;
        }
    },

    //Funcao para receber encomenda especifica
    getEncomendaByID: async (id) => {
        set({ loading: true, error: null })

        try {
            const response = await apiWithCreds.get(`/api/encomenda/getEncomendaFromID/${id}`);
            
            set({
                singleEncomenda: response.data[0],
                loading: false
            })

            return response.data[0]
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Não foi possível ir buscar a encomenda"
            })
            return null;
        }
    },

    //Obter produtos dentro de uma encomenda
    getProdutosEncomenda: async () => {
        set({loading: true, error:null})

        try {
            const {singleEncomenda} = get()
            const resp = await apiWithCreds.get(`/api/encomendaProducts/getAllProductsFromEncomenda/${singleEncomenda.id_encomenda}`)
            set({
                encomendaProducts: resp.data,
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                encomendaProducts: [],
                loading: false,
                error: err.response?.data?.message || "Produtos do carrinho não encontrados"
            })
            return null;
        }
    },

    //Obter todas as encomendas
    getAllEncomendasByUser: async () => {
        set({loading: true, error:null})

        try {
            const {userStore} = get()
            const resp = await apiWithCreds.get(`/api/encomenda/getEncomendasFromUserID/${userStore.id_utilizador_compras}`)
            set({
                encomendas: resp.data,
                loading: false
            })
            return resp.data;
        } catch (err) {
            set({
                encomendas: [],
                loading: false,
                error: err.response?.data?.message || "Encomendas não encontradas"
            })
            return null;
        }
    },

    //apaga encomenda especifica
    deleteEncomenda: async (id_encomenda) => {
        set({ loading: true, error: null })

        try {
            const resp = await apiWithCreds.delete(`/api/encomenda/${id_encomenda}`)
            get().getAllEncomendasByUser()

            set({
                loading: false
            })

            return true
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Não foi possível apagar esta encomenda"
            })
            return false;
        }
    },

    ////////////
    //Funcoes da navbar
    ////////////

    isCartDrawerOpen: false,

    openCartDrawer: () => {
        set({ isCartDrawerOpen: true });
    },

    closeCartDrawer: () => {
        set({ isCartDrawerOpen: false });
    },

    toggleCartDrawer: () => {
        set((state) => ({
            isCartDrawerOpen: !state.isCartDrawerOpen
        }));
    },
}))