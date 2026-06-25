import React, { useState } from 'react'
import {startOfWeek, addDays, isSameDay} from 'date-fns'
import {pt} from 'date-fns/locale'
import { useAuth } from '../../constants/useAuth';
import ExplicTimeCard from '../ExplicTimeCard';

function WeekCalendar({dia , explicList}) {
  {/* Componente de desenho para hoorario semanal */}
  const inicioSemana = startOfWeek(dia, {weekStartsOn: 0})
  const diasSemana = Array.from({length: 7}, (_,i) => addDays(startOfWeek(dia, {weekStartsOn: 0}),i))
  const {explicData, checkExplicacoes} = useAuth()

  return (
    <div className='overflow-x-auto'>
      <div className='grid grid-cols-7 min-w-350 gap-4'>
        {diasSemana.map((dia) => (
          <div key={dia.toISOString()} className='bg-base-200 p-3 min-h-125'>
            <h3 className='font-bold text-center mb-4'>
              {dia.toLocaleDateString('pt-PT', {
                weekday: 'short',
                day: 'numeric',
                month: 'long'
              })}
            </h3>

            <div className='space-y-2'>
              {explicList.filter((explic) => isSameDay(new Date(explic.data_inicio),dia)).map((explic) => 
                <ExplicTimeCard key={explic.id_explicacao} explicacao={explic} page={"WeekCalendar"}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeekCalendar
