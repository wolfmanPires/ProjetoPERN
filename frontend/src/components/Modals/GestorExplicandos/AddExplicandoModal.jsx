import React, { useState } from 'react'
import { gestorAuth } from '../../../constants/gestorAuth'
import { Eye, EyeClosed, PlusCircleIcon } from 'lucide-react'

function AddExplicandoModal() {
  const {newUtilizador, newExplicando, setNewUtilizador, setNewExplicando, resetNewUtilizador, resetNewExplicando, loading, createExplicando} = gestorAuth()
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
    createExplicando();
    document.getElementById("addExplicandoModal").close();
  }

  return (
    <dialog id='addExplicandoModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewExplicando()
            resetNewUtilizador()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Novo Explicando </h3>

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

            {/* Entrada do Email */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Palavra-Passe de Acesso (temporária)</span>
              </label>
              <div className='relative'>
                <input type={isVisible ? 'text' : 'password'} placeholder='Insira uma palavra-passe...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newUtilizador.password} onChange={(e => setNewUtilizador({...newUtilizador, password: e.target.value}))}/> 
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-base-content/50' onClick={handleVisibility}>
                  {isVisible && <Eye className='size-5' />}
                  {!isVisible && <EyeClosed className='size-5' />}
                </button>
              </div>
            </div>

            {/* Setor de Explicando */}
            <h2 className='font-semibold text-lg'> Dados de Explicando </h2>

            {/* Entrada de Especialidades */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Dificuldades</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira as especialidades...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicando.dificuldades} onChange={(e => setNewExplicando({...newExplicando, dificuldades: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada de Ano */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Ano de escolaridade</span>
              </label>
              <div className='relative'>
                <input type='number' min="0" max="12" placeholder='Insira o ano de escolaridade...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicando.ano} onChange={(e => setNewExplicando({...newExplicando, ano: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do valor da mensalidade */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Valor da Mensalidade</span>
              </label>
              <div className='relative'>
                <input type='number' placeholder='Insira o valor da mensalidade...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicando.valor_mensalidade} onChange={(e => setNewExplicando({...newExplicando, valor_mensalidade: e.target.value}))}/> 
              </div>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewUtilizador(); resetNewExplicando();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newUtilizador.nome || !newUtilizador.email || !newUtilizador.telemovel || !newUtilizador.password || !newExplicando.dificuldades || !newExplicando.ano || loading }>
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
            resetNewExplicando()
            resetNewUtilizador()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default AddExplicandoModal
