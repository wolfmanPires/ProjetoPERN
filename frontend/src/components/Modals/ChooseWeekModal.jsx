import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { pt } from "react-day-picker/locale";
import { rangeIncludesDate } from 'react-day-picker'; //Usar para procurar e definir semana
import { startOfWeek, endOfWeek } from 'date-fns'

function ChooseWeekModal({onSelectDia}) {
  const [dia, setDia] = useState(new Date())
  const [selectedWeek, setSelectedWeek] = useState()

  const customSubmit = (e) => {
    e.preventDefault();
    onSelectDia(dia);
    document.getElementById("chooseWeekModal").close();
  }

  return (
    <dialog id='chooseWeekModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        <h3 className='text-xl font-semibold'>
          Escolha a semana a procurar:
        </h3>

        {/* Escolher semana */}
        <form onSubmit={customSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-4'>
            <label className='label'>
              {selectedWeek && `Semana escolhida: ${selectedWeek?.from?.toLocaleDateString()} até ${selectedWeek?.to?.toLocaleDateString()}`}
            </label>
            <div className='w-full'>
              <DayPicker locale={pt} required showWeekNumber showOutsideDays animate
                modifiers={{
                  selected : selectedWeek,
                  range_start: selectedWeek?.from,
                  range_end: selectedWeek?.to,
                  range_middle: (date) => 
                    selectedWeek ? rangeIncludesDate(selectedWeek, date, true) : false,
                }}
                onDayClick={(day, modifiers) => {
                  if(modifiers.disabled || modifiers.hidden){return}
                  if(modifiers.selected){
                    setSelectedWeek(undefined);
                    return;
                  }
                  setDia(day)
                  setSelectedWeek({
                    from: startOfWeek(day),
                    to: endOfWeek(day)
                  })
                }}
                
                />
            </div>
          </div>
        
          {/* Botao de confirmar */}
          <div className='modal-action'>
              <button type='submit' className='btn btn-primary min-w-30'>
                Confirmar semana
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

export default ChooseWeekModal
