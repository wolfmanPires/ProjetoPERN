import React from 'react'
import Select from 'react-select'
import { gestorAuth } from '../../../constants/gestorAuth'
import { PlusCircleIcon } from 'lucide-react'
import AddDisciplinaModal from '../GestorDisciplinas/AddDisciplinaModal'
import { useEffect } from 'react'

function AddNotaModal({id_avalFutura}) {
  const {newNota, setNewNota, resetNewNota, loading, createNota, explicandos, disciplinas, getAllExplicandos, getAllDisciplinas} = gestorAuth()

  useEffect(() => {
    getAllExplicandos()
    getAllDisciplinas()
  },[])

  //Envia os dados para criar explicador novo
  const handleSubmit = (e) => {
    e.preventDefault();

    const timestamp = newNota.data_avaliacao.replace("T", " ")
    setNewNota({...newNota, data_avaliacao: timestamp})

    createNota(id_avalFutura);
    document.getElementById("addNotaModal").close();
  }

  return (
    <dialog id='addNotaModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewNota()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Nota </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Utilizador */}
            <h2 className='font-semibold text-lg'> Dados da Nota </h2>

            {/* Entrada da Data Avaliacao */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Avaliação</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newNota.data_avaliacao} onChange={(e => setNewNota({...newNota, data_avaliacao: e.target.value}))}/> 
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
                  value={newNota.descricao} onChange={(e => setNewNota({...newNota, descricao: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do valor */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Valor</span>
              </label>
              <div className='relative'>
                <input type='number' placeholder='Insira a nota final...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newNota.valor} onChange={(e => setNewNota({...newNota, valor: e.target.value}))}/> 
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
                })),
                {
                  value: "novadisciplina",
                  label: "+ Criar nova disciplina",
                },]}
                value={[...disciplinas.map(d => ({
                  value: d.id_disciplina,
                  label: `${d.nome} - ${d.ano}º ano`
                })),
                {
                  value: "novadisciplina",
                  label: "+ Criar nova disciplina",
                },].find(op => op.value === newNota.id_disciplina)}
                onChange={(option) => {
                  if(option.value === "novadisciplina"){
                    document.getElementById("addDisciplinaModal").showModal()
                    return
                  }

                  setNewNota({
                  ...newNota,
                  id_disciplina: option.value})
                }}
                placeholder="Escolha uma disciplina..." isSearchable/>
            </div>

            {/* Escolher Explicando */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text text-base font-medium'>Explicando</span>
              </label>
              
              <Select options={explicandos.map(e => ({
                  value: e.id_explicando,
                  label: `${e.nome}`
                }))}
                value={explicandos.map(e => ({
                  value: e.id_explicando,
                  label: `${e.nome}`
                })).find(op => op.value === newNota.id_explicando)}
                onChange={(option) => setNewNota({
                  ...newNota,
                  id_explicando: option.value})}
                placeholder="Escolha um explicando..." isSearchable/>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de produto */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewNota();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newNota.data_avaliacao || !newNota.descricao || !newNota.valor || !newNota.id_explicando || !newNota.id_disciplina || loading }>
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
            resetNewNota()
          }}>Fechar</button>
        </form>
        
      </div>

      <AddDisciplinaModal />
    </dialog>
  )
}

export default AddNotaModal
