import React from 'react'
import { gestorAuth } from '../../../constants/gestorAuth'
import { PlusCircleIcon } from 'lucide-react'

function EditDisciplinaModal() {
  const {newDisciplina, setNewDisciplina, resetNewDisciplina, loading, editDisciplina, editIDdisciplina} = gestorAuth()

  //Envia os dados para criar disciplina nova
  const handleSubmit = (e) => {
    e.preventDefault();
    editDisciplina(editIDdisciplina);
    document.getElementById("editDisciplinaModal").close();
  }

  return (
    <dialog id='editDisciplinaModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewDisciplina()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Nova Disciplina </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Disciplina */}
            <h2 className='font-semibold text-lg'> Dados da Disciplina </h2>

            {/* Entrada do Nome */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Nome da Disciplina</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira o nome e apelido...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newDisciplina.nome} onChange={(e => setNewDisciplina({...newDisciplina, nome: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do Ano */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Ano</span>
              </label>
              <div className='relative'>
                <input type='number' min='0' max='12' placeholder='Insira o ano...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newDisciplina.ano} onChange={(e => setNewDisciplina({...newDisciplina, ano: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da area cientifica */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Área Científica</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira a área científica da disciplina...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newDisciplina.area_cientifica} onChange={(e => setNewDisciplina({...newDisciplina, area_cientifica: e.target.value}))}/> 
              </div>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de produto */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewDisciplina();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newDisciplina.nome || !newDisciplina.ano || !newDisciplina.area_cientifica || loading }>
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
            resetNewDisciplina()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default EditDisciplinaModal
