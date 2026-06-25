import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { pt } from "react-day-picker/locale";

function ChooseDayModal({onSelectDia}) {
  const [selected, setSelected] = useState(new Date())
  {/* Envia de volta o dia selecionado */}
  const customSubmit = (e) => {
    e.preventDefault();
    onSelectDia(selected);
    document.getElementById("chooseDayModal").close();
  }

  return (
    <dialog id='chooseDayModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        
        <h3 className='text-xl font-semibold'>
          'Escolha o dia a procurar:'
        </h3>
        
        {/* Escolher dia */}
        <form onSubmit={customSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-4'>
            <label className='label'>
              Dia escolhido: {selected.toLocaleDateString()}
            </label>
            <div className='w-full'>
              <DayPicker mode="single" locale={pt} selected={selected} onSelect={setSelected} required animate/>
            </div>
          </div>

          {/* Botao de confirmar */}
          <div className='modal-action'>
            <button type='submit' className='btn btn-primary min-w-30'>
              Confirmar dia
            </button>
          </div>
        </form>
        
      </div>

      {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
      <form method="dialog" className='modal-backdrop'>
        <button>Fechar</button>
      </form>
    </dialog>
  )
}

export default ChooseDayModal
