import React from 'react'
import { useProduct } from '../../constants/product'
import { EuroIcon, ImageIcon, Package2Icon, PlusCircleIcon } from 'lucide-react';

function AddProductModal() {
  const { formData, setFormData, resetFormData, addProduct, loading} = useProduct();
  return (
    <dialog id="addProductModal" className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-8'> Adicionar Novo Produto </h3>

        <form onSubmit={addProduct} className='space-y-6'>
            <div className='grid gap-6'>
                {/* Entrada do Nome */}
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text text-base font-medium'>Nome do Produto</span>
                    </label>
                    <div className='relative'>
                        <input type='text' placeholder='Insira o nome do produto...'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={formData.name} onChange={(e => setFormData({...formData, name: e.target.value}))}/> {/* ... e o 'spread operator', ou seja, deconstroi um array de forma a ficar elemento a elemento*/}
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <Package2Icon className='size-5' />
                        </div>
                    </div>
                </div>

                {/* Entrada do Preço (repetir passos do nome, mas alterar codigo para acomodar preço)*/}
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text text-base font-medium'>Preço</span>
                    </label>
                    <div className='relative'>
                        <input type='number' min="0" step="0.01" placeholder='0.00'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={formData.price} onChange={(e => setFormData({...formData, price: e.target.value}))}/> 
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <EuroIcon className='size-5' />
                        </div>
                    </div>
                </div>

                {/* Entrada da Imagem */}
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text text-base font-medium'>Imagem (URL)</span>
                    </label>
                    <div className='relative'>
                        <input type='text' placeholder='https://example.com/image.jpg'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={formData.image} onChange={(e => setFormData({...formData, image: e.target.value}))}/> 
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <ImageIcon className='size-5' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmar/Cancelar adicao de produto */}
            <div className='modal-action'>
                <button  type='reset' className='btn btn-ghost' onClick={(resetFormData)}>Apagar Campos</button>
                <form method='dialog'>
                    <button className='btn btn-alert'>Cancelar</button>
                </form>
                <button type='submit' className='btn btn-primary min-w-30'
                        disabled={!formData.name || !formData.price || !formData.image || loading }>
                    {/* Funcao de verdadeiro/falso, 1o corre quando verdade 2o corre quando falso */}
                    {loading ? (
                        <span className='loading loading-spinner loading-sm'/>
                    ) : (
                        <>
                            <PlusCircleIcon className='size-5 mr-2' />
                            Adicionar
                        </>
                    )}

                </button>
            </div>

        </form>
      </div>

      {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
      <form method="dialog" className='modal-backdrop'>
        <button>Fechar</button>
      </form>
    </dialog>
  )
}

export default AddProductModal
