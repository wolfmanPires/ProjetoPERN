import { PlusCircle } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../constants/useAuthStore'

function ProductClientCard({product}) {
  const {userStore, carrinho, carrinhoProducts, specificProduto, addProductToCarrinho, getSpecificProdutoCarrinho, cleanSpecificProduto, openCartDrawer} = useAuthStore()
  const navigate = useNavigate()
  //Funcao para adicionar objeto ao carrinho
  const addToCarrinho = async () => {
    if (Number(product.stock) <= 0) return

    if (!userStore) {
      navigate("/storeLogin")
      return
    }

    const produtoExistente = await getSpecificProdutoCarrinho(product.id_products)

    if (!produtoExistente) {
      await addProductToCarrinho(product.id_products)
    }

    openCartDrawer()
  }

  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-colors duration-300'>
      
      {/* Imagem do Produto */}
      <figure className='relative pt-[56.25%]'>
        <img src={product.image} alt={product.name} className='absolute top-0 left-0 w-full h-full object-cover' />
      </figure>

      {/* Corpo do Produto */}
      <div className='card-body'>
        <h2 className='card-title text-lg font-semibold'> {product.name} </h2>
        <p className='text-2xl font-bold text-primary'> ${Number(product.price).toFixed(2)} </p>

        {/* Avisos de stock dos produtos */}
        {(product.stock <= 25) && (product.stock>0) && (
          <p className='text-lg font-bold text-warning'> Artigo quase a esgotar! </p>
        )}
        {(product.stock <= 0) && (
          <p className='text-lg font-bold text-error'> Artigo esgotado! </p>
        )}

        {/* Botao de adicionar ao carrinho */}
        <div className='flex justify-end'>
          <button className='btn bg-primary text-base-100' disabled={Number(product.stock) <= 0} onClick={addToCarrinho}>
            <PlusCircle className='size-5' />
            Adicionar
          </button>
        </div>
      </div>  
    </div>
  )
}

export default ProductClientCard
