import React, { useState } from 'react'
import { gestorAuthStore } from '../../../constants/gestorAuthStore'
import { Eye, EyeClosed, PlusCircleIcon } from 'lucide-react'

function AddClienteModal() {
  const {newCliente, setNewCliente, resetNewCliente, loading, createCliente, createGestor} = gestorAuthStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isGestor, setIsGestor] = useState(false)

  //Muda o botao de visibilidade
  const handleVisibility = () => {
    if(isVisible){
      setIsVisible(false)
    }else{
      setIsVisible(true)
    }
  }

  //Envia os dados para criar explicador novo
  const handleSubmit = (e) => {
    e.preventDefault();
    if(isGestor){
      createGestor();
    }else{
      createCliente();
    }
    document.getElementById("addClienteModal").close();
  }

  return (
    <dialog id='addClienteModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewCliente()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Novo Cliente </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>

            {/* Entrada do Nome */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Nome e Apelido</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira o nome e apelido...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newCliente.nome} onChange={(e => setNewCliente({...newCliente, nome: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do Email */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>E-mail do Cliente</span>
              </label>
              <div className='relative'>
                <input type='email' placeholder='Insira o e-mail...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newCliente.email} onChange={(e => setNewCliente({...newCliente, email: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do telemovel */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Nº de telemóvel</span>
              </label>
              <div className='relative'>
                <input type='tel' placeholder='Insira o nº de telemóvel...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newCliente.telemovel} onChange={(e => setNewCliente({...newCliente, telemovel: e.target.value}))}/> 
              </div>
            </div>

            {/* Escolher se e um gestor ou não */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Tipo de conta:</span>
              </label>

              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="lecionada" className="radio radio-success" checked={isGestor === true} onChange={() => setIsGestor(true)}/>
                  <span className="label-text">Gestor</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="lecionada" className="radio radio-error" checked={isGestor === false} onChange={() => setIsGestor(false)}/>
                  <span className="label-text">Cliente</span>
                </label>
              </div>
            </div>

            {/* Entrada do Password */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Palavra-Passe de Acesso (temporária)</span>
              </label>
              <div className='relative'>
                <input type={isVisible ? 'text' : 'password'} placeholder='Insira uma palavra-passe...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newCliente.password} onChange={(e => setNewCliente({...newCliente, password: e.target.value}))}/> 
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-base-content/50' onClick={handleVisibility}>
                  {isVisible && <Eye className='size-5' />}
                  {!isVisible && <EyeClosed className='size-5' />}
                </button>
              </div>
            </div>


          </div>

          {/* Confirmar/Cancelar adicao */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewCliente();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newCliente.nome || !newCliente.email || !newCliente.telemovel || loading }>
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

        {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
        <form method="dialog" className='modal-backdrop'>
          <button onClick={() => {
            resetNewCliente()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default AddClienteModal
