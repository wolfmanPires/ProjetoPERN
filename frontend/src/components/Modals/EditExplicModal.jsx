import { Check, SquarePen, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useAuth } from '../../constants/useAuth'

function EditExplicModal() {
  const {currSpecificExplic, setSpecificExplic, specificExplic, editExplicacao, toggleLecionada, checkExplicacoes} = useAuth()

  const customSubmit = (e) => {
    e.preventDefault();
    editExplicacao(currSpecificExplic[0].id_explicacao);
    checkExplicacoes();
    document.getElementById("editExplicModal").close();
  }

  return (
    <dialog id='editExplicModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        <h3 className='text-xl font-semibold'>
          Editar explicação
        </h3>

        {/* Inputs para mudar explicacao */}
        <form onSubmit={customSubmit}>
          <div className='grid gap-4'>
            {/* Area da descricao da explicacao */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Descrição da explicação:</span>
                </label>
                <input type='text' placeholder='Insira uma descrição à explicação...' className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                  value={specificExplic.descricao} onChange={(e => setSpecificExplic({...specificExplic, descricao: e.target.value}))}/>
            </div>

            {/* Mudar estado de lecionado */}
            <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Explicação foi lecionada?</span>
                  <label className='swap shadow-primary pl-2'>
                    <input type="checkbox" checked={specificExplic.lecionada} onChange={(e) => { e.preventDefault() ;toggleLecionada(currSpecificExplic[0].id_explicacao, e.target.checked)}} />
                    <Check className='swap-on size-5' />
                    <X className='swap-off size-5' />
                  </label>
                </label>
            </div>
          </div>

          {/* Botao de confirmar */}
          <div className='modal-action'>
              <button type='submit' className='btn btn-primary min-w-30'>
                <SquarePen/> Confirmar Edição
              </button>
          </div>
        </form>

        {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
        <form method="dialog" className='modal-backdrop'>
          <button>Fechar</button>
        </form>
      </div>
    </dialog>
  )
}

export default EditExplicModal
