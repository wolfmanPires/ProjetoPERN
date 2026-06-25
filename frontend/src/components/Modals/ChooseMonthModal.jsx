import React, { useState } from 'react'

function ChooseMonthModal({onSelectDia}) {
  const [selected, setSelected] = useState(new Date())
  const customSubmit = (e) => {
    e.preventDefault();
    onSelectDia(selected);
    document.getElementById("chooseMonthModal").close();
  }

  return (
    <dialog id='chooseMonthModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        <h3 className='text-xl font-semibold mb-4'>
          Escolha o mês a procurar:
        </h3>

        <form onSubmit={customSubmit} className='space-y-6'>
          <input type='month' className='input input-bordered w-full' value={`${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}`}
            onChange={(e) => {
              const [ano, mes] = e.target.value.split("-")
              setSelected(new Date(Number(ano),Number(mes)-1,1))
            }}/>

          {/* Botao de confirmar */}
          <div className='modal-action'>
              <button type='submit' className='btn btn-primary min-w-30'>
                Confirmar mês
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

export default ChooseMonthModal
