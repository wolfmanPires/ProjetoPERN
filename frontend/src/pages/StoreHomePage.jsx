import React, { useEffect } from 'react'
import { useProduct } from '../constants/product'
import { PlusCircleIcon, RefreshCcwIcon, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import logoLoja from '../assets/int-loja-BGless.png'
import ProductClientCard from '../components/ProductClientCard';
import { useAuthStore } from '../constants/useAuthStore';
import { useState } from 'react';

function StoreHomePage() {
  const {products, loading, error, fetchProducts} = useProduct();
  const {userStore, carrinho, checkUserStore, getCarrinho, getProdutosCarrinho} = useAuthStore()
  const [pesquisa, setPesquisa] = useState("")
  const [ordenacao, setOrdenacao] = useState("data-recentes")
  useEffect(() => {
    checkForCarrinho()

    fetchProducts()
  },[fetchProducts])

  const checkForCarrinho = () => {
    //Se houver cliente, ver carrinho
    checkUserStore()
    if(userStore){
      //Se houver carrinho, ver produtos
      getCarrinho()
      if(carrinho){
        //Se houver produtos associados ao carrinho, mostrar-los
        getProdutosCarrinho()
      }
    }
  }

  const produtosFiltradosOrdenados = [...products].filter((produto) => {
    const nome = produto.name || "";

    return nome.toLowerCase().includes(pesquisa.trim().toLowerCase());
  }).sort((produtoA, produtoB) => {
    switch (ordenacao) {
      case "data-antigos":
        return (new Date(produtoA.created_at) - new Date(produtoB.created_at));

      case "data-recentes":
        return (new Date(produtoB.created_at) - new Date(produtoA.created_at));

      case "preco-menor":
        return (Number(produtoA.price) - Number(produtoB.price));

      case "preco-maior":
        return (Number(produtoB.price) - Number(produtoA.price));

      case "stock-menor":
        return (Number(produtoA.stock) - Number(produtoB.stock));

      case "stock-maior":
        return (Number(produtoB.stock) - Number(produtoA.stock));

      default:
        return 0;
    }
  });
  
  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>

      <div className='flex justify-center'>
        <img src={logoLoja} alt='Logotipo ASAS' className='w-1/2'/>
      </div>

      <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end'>
        <div className="form-control w-full sm:flex-1">
          <label className="input input-bordered flex items-center gap-2 w-80">
            <Search className="size-4"/>
            <input type="text" className="grow" placeholder="Pesquisar nome..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
          </label>
        </div>

        {/* Botoes de ordenar como produtos aparecem */}
        <div className="form-control w-full sm:w-64">
          <select id="ordenacao-produtos" className="select select-bordered w-full" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} >
            <optgroup label="Data de criação">
              <option value="data-recentes">
                Mais recentes
              </option>

              <option value="data-antigos">
                Mais antigos
              </option>
            </optgroup>

            <optgroup label="Preço">
              <option value="preco-menor">
                Preço mais baixo
              </option>

              <option value="preco-maior">
                Preço mais alto
              </option>
            </optgroup>

            <optgroup label="Stock disponível">
              <option value="stock-maior">
                Mais stock
              </option>

              <option value="stock-menor">
                Menos stock
              </option>
            </optgroup>
          </select>
        </div>

        {/* Botao de Refrescar a Pagina */}
        <div className='flex justify-end'>
          <button className='btn btn-ghost btn-circle'>
            <RefreshCcwIcon className='size-5' />
          </button>
        </div>
      </div>

      {/* Mostrar Erros */}
      {error && <div className='alert alert-error mb-8'>{error}</div>}

      {/* Mostrar Que Esta a Carregar */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='loading loading-spinner loading-lg' />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {produtosFiltradosOrdenados.map(product => (
            <ProductClientCard key={product.id_products} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

export default StoreHomePage
