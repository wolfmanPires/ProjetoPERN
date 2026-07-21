import React from 'react'
import { gestorAuth } from '../../../constants/gestorAuth'
import Select from 'react-select'
import { PlusCircleIcon } from 'lucide-react'

function AddPagamentoModal() {
  const {newPagamento, setNewPagamento, resetNewPagamento, loading, createPagamento, utilizadores} = gestorAuth()

  //Envia os dados para criar pagamento novo
  const handleSubmit = (e) => {
    e.preventDefault();

    const timestampVencimento = newPagamento.data_vencimento.replace("T", " ")
    setNewPagamento({...newPagamento, data_vencimento: timestampVencimento})

    if(newPagamento.data_pago){
      const timestampPagamento = newPagamento.data_pago.replace("T", " ")
      setNewPagamento({...newPagamento, data_pago: timestampPagamento})
    }

    createPagamento();
    document.getElementById("addPagamentoModal").close();
  }

  return (
    <dialog id='addPagamentoModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => {
            resetNewPagamento()
          }}>X</button>
        </form>

        {/* Header do Modal */}
        <h3 className='font-bold text-xl mb-4'> Adicionar Pagamento </h3>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6'>
            {/* Setor de Utilizador */}
            <h2 className='font-semibold text-lg'> Dados do Pagamento </h2>

            {/* Entrada da Descricao */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Descrição Breve</span>
              </label>
              <div className='relative'>
                <input type='text' placeholder='Insira uma descrição da nota...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newPagamento.tipo} onChange={(e => setNewPagamento({...newPagamento, tipo: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada do valor */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Valor</span>
              </label>
              <div className='relative'>
                <input type='number' placeholder='Insira o valor monetário em Euros €...'
                  className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newPagamento.valor} onChange={(e => setNewPagamento({...newPagamento, valor: e.target.value}))}/> 
              </div>
            </div>

            {/* Escolher tipo: Receita ou Despesa */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Tipo de Pagamento</span>
              </label>

              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="is_receita" className="radio radio-success" checked={newPagamento.is_receita === true} onChange={() => setNewPagamento({ ...newPagamento, is_receita: true})}/>
                  <span className="label-text">Receita</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="is_receita" className="radio radio-error" checked={newPagamento.is_receita === false} onChange={() => setNewPagamento({...newPagamento, is_receita: false})}/>
                  <span className="label-text">Despesa</span>
                </label>
              </div>
            </div>

            {/* Entrada da Data Vencimento */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Vencimento</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newPagamento.data_vencimento} onChange={(e => setNewPagamento({...newPagamento, data_vencimento: e.target.value}))}/> 
              </div>
            </div>

            {/* Entrada da Data Pagamento */}
            <div className='form-control'>
              <label className='label'>
                  <span className='label-text text-base font-medium'>Data de Pagamento</span>
              </label>
              <div className='relative'>
                <input type='datetime-local' className='input input-bordered w-full pl-3 py-3 focus:input-primary transition-colors duration-200'
                  value={newPagamento.data_pago} onChange={(e => setNewPagamento({...newPagamento, data_pago: e.target.value}))}/> 
              </div>
            </div>

            {/* Escolher Utilizador */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text text-base font-medium'>Utilizador</span>
              </label>
              
              <Select options={utilizadores.map(e => ({
                  value: e.id_utilizador,
                  label: `${e.nome}`
                }))}
                value={utilizadores.map(e => ({
                  value: e.id_utilizador,
                  label: `${e.nome}`
                })).find(op => op.value === newPagamento.id_utilizador)}
                onChange={(option) => setNewPagamento({
                  ...newPagamento,
                  id_utilizador: option.value})}
                placeholder="Escolha um utilizador..." isSearchable/>
            </div>

          </div>

          {/* Confirmar/Cancelar adicao de produto */}
          <div className='modal-action'>
            <button  type='reset' className='btn btn-ghost' onClick={()=>{resetNewPagamento();}}>Apagar Campos</button>
            <form method='dialog'>
              <button className='btn btn-alert'>Cancelar</button>
            </form>
            <button type='submit' className='btn btn-primary min-w-30'
              disabled={!newPagamento.data_vencimento || !newPagamento.valor || !newPagamento.id_utilizador || !newPagamento.tipo || loading }>
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
            resetNewPagamento()
          }}>Fechar</button>
        </form>
        
      </div>
    </dialog>
  )
}

export default AddPagamentoModal
