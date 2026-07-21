import React, { useState } from 'react'
import { gestorAuth } from '../../../constants/gestorAuth'
import { Eye, EyeClosed, PlusCircleIcon } from 'lucide-react'

function EditGestorModal() {
  const {newUtilizador, setNewUtilizador, resetNewUtilizador, loading, editGestor, editIDutilizador} = gestorAuth()
  const [isVisible, setIsVisible] = useState(false)

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
    editGestor(editIDutilizador);
    document.getElementById("editGestorModal").close();
  }

  return (
    <dialog id='editGestorModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewUtilizador()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Editar Gestor - {newUtilizador.nome} </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Utilizador */}
            <h2 className='font-semibold text-lg'> Dados de Utilizador </h2>

            {/* Entrada do Nome */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Nome e Apelido</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira o nome e apelido...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newUtilizador.nome} onChange={(e => setNewUtilizador({...newUtilizador, nome: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do Email */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>E-mail do Utilizador</span>
              </label>
              <div className='relative'>
                <input type='email' placeholder='Insira o e-mail...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newUtilizador.email} onChange={(e => setNewUtilizador({...newUtilizador, email: e.target.value}))}/> 
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
                  value={newUtilizador.telemovel} onChange={(e => setNewUtilizador({...newUtilizador, telemovel: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da password*/}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Palavra-Passe Nova</span>
              </label>
              <div className='relative'>
                <input type={isVisible ? 'text' : 'password'} placeholder='Palavra-Passe'
                  className='input input-bordered w-full py-3 focus:input-primary transition-colors duration-200'
                  value={newUtilizador.password} onChange={(e) => {setNewUtilizador({...newUtilizador, password:e.target.value})}}/> 
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-base-content/50' onClick={handleVisibility}>
                  {isVisible && <Eye className='size-5' />}
                  {!isVisible && <EyeClosed className='size-5' />}
                </button>
              </div>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de produto */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewUtilizador();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newUtilizador.nome || !newUtilizador.email || !newUtilizador.telemovel || loading }>
              {/* Funcao de verdadeiro/falso, 1o corre quando verdade 2o corre quando falso */}
              {loading ? (
                <span className='loading loading-spinner loading-sm'/>
              ) : (
                <>
                  <PlusCircleIcon className='size-5 mr-2' />
                    Editar
               </>
              )}
            </button>
          </div>

        </form>

        {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
        <form method="dialog" className='modal-backdrop'>
          <button onClick={() => {
            resetNewUtilizador()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default EditGestorModal
