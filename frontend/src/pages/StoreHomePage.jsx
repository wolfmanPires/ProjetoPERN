import React, { useEffect } from 'react'
import { useProduct } from '../constants/product'
import { PlusCircleIcon, RefreshCcwIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/Modals/AddProductModal';

function StoreHomePage() {
  const {products, loading, error, fetchProducts} = useProduct();
  useEffect(() => {
    fetchProducts()
  },[fetchProducts])
  
  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>

        {/* Botao de Adicao */}
        <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addProductModal").showModal()} >
          <PlusCircleIcon className='size-5 mr-2' />
          Adicionar Produto
        </button>

        {/* Botao de Refrescar a Pagina */}
        <button className='btn btn-ghost btn-circle'>
          <RefreshCcwIcon className='size-5' />
        </button>
      </div>

      <AddProductModal />

      {/* Mostrar Erros */}
      {error && <div className='alert alert-error mb-8'>{error}</div>}

      {/* Mostrar Que Esta a Carregar */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='loading loading-spinner loading-lg' />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

export default StoreHomePage
