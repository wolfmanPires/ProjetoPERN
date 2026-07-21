import React from 'react'
import Select from 'react-select'
import AddDisciplinaModal from './GestorDisciplinas/AddDisciplinaModal';
import { gestorAuth } from '../../constants/gestorAuth';
import { PlusCircleIcon } from 'lucide-react';
import { useAuth } from '../../constants/useAuth';

function AddAvalFuturaExplicandoModal({id_explicando}) {
  const {newAvalFutura, setNewAvalFutura, resetNewAvalFutura, loading, createAvalFutura, explicandos, disciplinas} = gestorAuth()
  const {getAvalFuturasExplicando} = useAuth()

  //Envia os dados para criar avaliacao futura nova
  const handleSubmit = (e) => {
    e.preventDefault();

    const timestamp = newAvalFutura.data.replace("T", " ")
    setNewAvalFutura({...newAvalFutura, data: timestamp})
    setNewAvalFutura({...newAvalFutura, id_explicando: id_explicando})
    
    createAvalFutura();
    getAvalFuturasExplicando();
    document.getElementById("addAvalFuturaExplicandoModal").close();
  }

  return (
    <dialog id='addAvalFuturaExplicandoModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewAvalFutura()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Avaliação Futura </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Utilizador */}
            <h2 className='font-semibold text-lg'> Dados da Avaliação </h2>

            {/* Entrada da Data Avaliacao */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Avaliação</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newAvalFutura.data} onChange={(e => setNewAvalFutura({...newAvalFutura, data: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da Descricao */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Descrição</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira uma descrição da nota...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newAvalFutura.descricao} onChange={(e => setNewAvalFutura({...newAvalFutura, descricao: e.target.value}))}/> 
              </div>
            </div>

            {/* Escolher Disciplina */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text text-base font-medium'>Disciplina</span>
              </label>

              <Select options={[...disciplinas.map(d => ({
                  value: d.id_disciplina,
                  label: `${d.nome} - ${d.ano}º ano`
                })),]}
                value={[...disciplinas.map(d => ({
                  value: d.id_disciplina,
                  label: `${d.nome} - ${d.ano}º ano`
                })),
                {
                  value: "novadisciplina",
                  label: "+ Criar nova disciplina",
                },].find(op => op.value === newAvalFutura.id_disciplina)}
                onChange={(option) => {
                  if(option.value === "novadisciplina"){
                    document.getElementById("addDisciplinaModal").showModal()
                    return
                  }

                  setNewAvalFutura({
                  ...newAvalFutura,
                  id_disciplina: option.value})
                }}
                placeholder="Escolha uma disciplina..." isSearchable/>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de produto */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewAvalFutura();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newAvalFutura.data || !newAvalFutura.descricao || !newAvalFutura.id_disciplina || loading }>
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
            resetNewAvalFutura()
          }}>Fechar</button>
        </form>
        
      </div>

      <AddDisciplinaModal />
    </dialog>
  )
}

export default AddAvalFuturaExplicandoModal
