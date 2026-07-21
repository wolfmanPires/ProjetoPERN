import React, { useState } from 'react'
import { gestorAuth } from '../../../constants/gestorAuth'
import { Eye, EyeClosed, PlusCircleIcon } from 'lucide-react'

function EditExplicadorModal() {
  const {newUtilizador, newExplicador, setNewUtilizador, setNewExplicador, resetNewUtilizador, resetNewExplicador, loading, editExplicador, editIDutilizador, editIDexplicador} = gestorAuth()
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
    editExplicador(editIDutilizador,editIDexplicador);
    document.getElementById("editExplicadorModal").close();
  }

  return (
    <dialog id='editExplicadorModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewExplicador()
            resetNewUtilizador()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Editar Explicador - {newUtilizador.nome} </h3>

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

            {/* Setor de Explicador */}
            <h2 className='font-semibold text-lg'> Dados de Explicador </h2>

            {/* Entrada de Especialidades */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Especialidades</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira as especialidades...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicador.especialidades} onChange={(e => setNewExplicador({...newExplicador, especialidades: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada de Habilitacoes */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Habilitações</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira as habilitacoes...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicador.habilitacoes} onChange={(e => setNewExplicador({...newExplicador, habilitacoes: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do valor a hora */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Valor a Receber por Hora</span>
              </label>
              <div className='relative'>
                <input type='number' placeholder='Insira o valor monetário em Euros €...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicador.valor_hora} onChange={(e => setNewExplicador({...newExplicador, valor_hora: e.target.value}))}/> 
              </div>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewUtilizador(); resetNewExplicador();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newUtilizador.nome || !newUtilizador.email || !newUtilizador.telemovel || !newExplicador.especialidades || !newExplicador.habilitacoes || loading }>
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
            resetNewExplicador()
            resetNewUtilizador()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default EditExplicadorModal
