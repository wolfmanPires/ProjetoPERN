import React, { useEffect } from 'react'
import { useProduct } from '../constants/product'
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon, TrashIcon } from 'lucide-react';

function ProductPage() {
  const {currProduct, formData, setFormData, loading, error, fetchProduct, updateProduct, deleteProduct} = useProduct();
  const navigate = useNavigate();
  //Resgata o parametro da linha que chama o ProductPage escrito a seguir de : (neste caso o :id)
  const {id} = useParams();
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);
  const handleDelete = async () => {
    if(window.confirm("De certeza que quer eliminar este produto?")){
      await deleteProduct(id);
      navigate("/store");
    }
  };

  if(loading){
    return(
      <div className='flex justify-center items-center min-h-screen'>
        <div className='leading loading-spinner loading-lg'/>
      </div>
    )
  }

  if(error){
    return(
      <div className='container mx-auto px-4 py-8'>
        <div className='alert alert-error'>{error}</div>
      </div>
    )
  }
  
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <button onClick={() => navigate("/store")} className='btn btn-ghost mb-8'>
        <ArrowLeftIcon className='size-4 mr-2'/>
        Voltar
      </button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Imagem */}
        <div className='rounded-lg overflow-hidden shadow-lg bg-base-100'>
          {(currProduct!=null) ? (
            <img src={currProduct[0]?.image} alt={currProduct[0]?.name} className='size-full object-cover'/>
          ) : (
            <img src="https://i.imgur.com/qu0J7Wb.png" alt="template" className='size-full object-cover'/>
          )}
        </div>

        {/* Formulario */}
        <div className='card bg-base-100 shadow-lg'>
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-6'>Editar Produtos</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateProduct(id);
            }} className='space-y-6'>
              {/* Nome */}
              <div className='form-control'>
                <label className='label'>
                  <span className="label-text text-base font-medium">Nome do Produto</span>
                </label>
                <input type="text" placeholder="Introduz nome de produto" className='input input-bordered w-full'
                       value={formData.name} onChange={(e) => setFormData({...formData, name:e.target.value})}/>
              </div>

              {/* Preco */}
              <div className='form-control'>
                <label className='label'>
                  <span className="label-text text-base font-medium">Preço do Produto</span>
                </label>
                <input type='number' min="0" step="0.01" placeholder='0.00' className='input input-bordered w-full'
                       value={formData.price} onChange={(e) => setFormData({...formData, price:e.target.value})}/>
              </div>

              {/* URL da Imagem */}
              <div className='form-control'>
                <label className='label'>
                  <span className="label-text text-base font-medium">Nome do Produto</span>
                </label>
                <input type="text" placeholder="https://example.com/image.jpg" className='input input-bordered w-full'
                       value={formData.image} onChange={(e) => setFormData({...formData, image:e.target.value})}/>
              </div>

              {/* Botoes de Acoes */}
              <div className='flex justify-between mt-8'>
                {/* Botao de Apagar */}
                <button type='button' onClick={handleDelete} className='btn btn-error'>
                  <TrashIcon className='size-4 mr-2'/>
                  Apagar Produto
                </button>

                {/* Botao de Editar */}
                <button type="submit" className='btn btn-primary' disabled={loading || !formData.name || !formData.price || !formData.image}>
                  {loading ? (
                    <span className='loading loading-spinner loading-sm'/>
                  ) : (
                    <>
                      <SaveIcon className='size-4 mr-2'/>
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
