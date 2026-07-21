import React from 'react'
import Select from 'react-select'
import { gestorAuth } from '../../../constants/gestorAuth'
import { PlusCircleIcon } from 'lucide-react'
import AddDisciplinaModal from '../GestorDisciplinas/AddDisciplinaModal';

function EditExplicacaoModal() {
  const {newExplicacao, setNewExplicacao, resetNewExplicacao, loading, editExplicacao, editIDexplicacao, explicacoes, explicadores, explicandos, disciplinas} = gestorAuth()

  //Envia os dados para criar explicacao nova
  const handleSubmit = (e) => {
    e.preventDefault();

    const timestampInicio = newExplicacao.data_inicio.replace("T", " ")
    setNewExplicacao({...newExplicacao, data_inicio: timestampInicio})
    const timestampFim = newExplicacao.data_fim.replace("T", " ")
    setNewExplicacao({...newExplicacao, data_fim: timestampFim})

    editExplicacao(editIDexplicacao);
    document.getElementById("editExplicacaoModal").close();
  }

  return (
    <dialog id='editExplicacaoModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewExplicacao()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Editar Explicação </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Utilizador */}
            <h2 className='font-semibold text-lg'> Dados da Explicação </h2>

            {/* Entrada da Data Inicio */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Início</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicacao.data_inicio} onChange={(e => setNewExplicacao({...newExplicacao, data_inicio: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da Data Fim */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Fim</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicacao.data_fim} onChange={(e => setNewExplicacao({...newExplicacao, data_fim: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da Descricao */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Descrição Breve</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira uma descrição da nota...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newExplicacao.descricao} onChange={(e => setNewExplicacao({...newExplicacao, descricao: e.target.value}))}/> 
              </div>
            </div>

            {/* Escolher se foi lecionada ou não */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Foi Lecionada:</span>
              </label>

              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="lecionada" className="radio radio-success" checked={newExplicacao.lecionada === true} onChange={() => setNewExplicacao({ ...newExplicacao, lecionada: true})}/>
                  <span className="label-text">Sim</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="lecionada" className="radio radio-error" checked={newExplicacao.lecionada === false} onChange={() => setNewExplicacao({...newExplicacao, lecionada: false})}/>
                  <span className="label-text">Não</span>
                </label>
              </div>
            </div>

            {/* Escolher se e uma explicacao recorrente semanalmente ou não */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Será uma explicação recorrente?</span>
              </label>

              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="repete_mensal" className="radio radio-success" checked={newExplicacao.repete_mensal === true} onChange={() => setNewExplicacao({ ...newExplicacao, repete_mensal: true})}/>
                  <span className="label-text">Sim</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="repete_mensal" className="radio radio-error" checked={newExplicacao.repete_mensal === false} onChange={() => setNewExplicacao({...newExplicacao, repete_mensal: false})}/>
                  <span className="label-text">Não</span>
                </label>
              </div>
              <label className="label">
                <span className="label-text text-base font-medium">
                  (Se esta explicação repetir no mesmo dia do mês e hora<br></br>todas as semanas, escolhe 'Sim')
                </span>
              </label>
            </div>

            {/* Escolher Explicador */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text text-base font-medium'>Explicador</span>
              </label>
              
              <Select options={explicadores.map(e => ({
                  value: e.id_explicador,
                  label: `${e.nome}`
                }))}
                value={explicadores.map(e => ({
                  value: e.id_explicador,
                  label: `${e.nome}`
                })).find(op => op.value === newExplicacao.id_explicador)}
                onChange={(option) => setNewExplicacao({
                  ...newExplicacao,
                  id_explicador: option.value})}
                placeholder="Escolha um explicador..." isSearchable/>
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
                })).find(op => op.value === newExplicacao.id_explicando)}
                onChange={(option) => setNewExplicacao({
                  ...newExplicacao,
                  id_explicando: option.value})}
                placeholder="Escolha um explicando..." isSearchable/>
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
                },].find(op => op.value === newExplicacao.id_disciplina)}
                onChange={(option) => {
                  if(option.value === "novadisciplina"){
                    document.getElementById("addDisciplinaModal").showModal()
                    return
                  }

                  setNewExplicacao({
                  ...newExplicacao,
                  id_disciplina: option.value})
                }}
                placeholder="Escolha uma disciplina..." isSearchable/>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de explicacao */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewExplicacao();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newExplicacao.data_inicio || !newExplicacao.data_fim || !newExplicacao.id_disciplina || !newExplicacao.id_explicador || !newExplicacao.id_explicando || !newExplicacao.descricao || loading }>
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
            resetNewExplicacao()
          }}>Fechar</button>
        </form>
        
      </div>

      <AddDisciplinaModal />

    </dialog>
  )
}

export default EditExplicacaoModal
