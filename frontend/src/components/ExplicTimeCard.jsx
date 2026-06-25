import React, { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useAuth } from '../constants/useAuth'
import EditExplicModal from './Modals/EditExplicModal';

function ExplicTimeCard({explicacao,page}) {
  const {loading, error, user, toggleLecionada, getSingleExplicacao} = useAuth();
  const hora_inicio = explicacao.data_inicio.slice(10,13) + "h" + explicacao.data_inicio.slice(14,16) + "m" 
  const hora_fim = explicacao.data_fim.slice(10,13) + "h" + explicacao.data_fim.slice(14,16) + "m"
  const diaData = explicacao.data_inicio.slice(0,10)
  const data = new Date(explicacao.data_inicio)
  const diaSemana = () => {
    switch (data.getDay()){
      case 0:
        return "Domingo";
      case 1:
        return "Segunda-Feira";
      case 2:
        return "Terça-Feira";
      case 3:
        return "Quarta-Feira";
      case 4:
        return "Quinta-Feira";
      case 5:
        return "Sexta-Feira";
      case 6:
        return "Sábado";
    }
  }

  return (
    <div>
        <div className='card bg-base-200 w-full shadow-sm' onClick={() => {
          getSingleExplicacao(explicacao.id_explicacao)
          document.getElementById("editExplicModal").showModal()
          }}>
          {(page === "CalendarHomePage") ? (
            <div className='card-body'>
                <h2 className='card-title'>{explicacao.nome}</h2>
                <p>{hora_inicio} - {hora_fim}</p>
                <div className=' flex justify-end items-center gap-2'>
                    <span>Lecionado:
                      <label className='swap shadow-primary pl-2'>
                        <input type="checkbox" checked={explicacao.lecionada} onChange={(e) => toggleLecionada(explicacao.id_explicacao, e.target.checked)} />
                        <Check className='swap-on size-5' />
                        <X className='swap-off size-5' />
                      </label>
                    </span>
                </div>
            </div>
          ) : (
            <div className='w-full'>
              {(page === "UserExplicacoes") ? (
                <div className='card-body'>
                  <h2 className='card-title'>{explicacao.nome}</h2>
                  <p>
                    {diaSemana()} &nbsp;&nbsp;&nbsp; {diaData} &nbsp;&nbsp;&nbsp; {hora_inicio} - {hora_fim}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>Lecionado:
                      <label className='swap shadow-primary pl-2'>
                        <input type="checkbox" checked={explicacao.lecionada} onChange={(e) => toggleLecionada(explicacao.id_explicacao, e.target.checked)} />
                        <Check className='swap-on size-5' />
                        <X className='swap-off size-5' />
                      </label>
                    </span>
                  </p>    
                </div>
              ) : (
                <div className='w-full'>
                  {(page === 'WeekCalendar') ? (
                    <div className='card-body'>
                      <h2 className='card-title'>{explicacao.nome}</h2>
                      <p> {diaSemana()} </p>
                      <p> {diaData} </p>
                      <p> {hora_inicio} - {hora_fim} </p>
                      <span>Lecionado:
                        <label className='shadow-primary pl-2'>
                          {(explicacao.lecionada === true) ? (<Check className='swap-on size-5' />) : (<X className='swap-off size-5' />)}
                        </label>
                      </span>   
                    </div>
                  ) : (
                    <div> Erro em ExplicTimeCard </div>
                  )}
                </div>
              )}
            </div>
            
          )}

          {/*<EditExplicModal explicacao={explicacao} />*/}  
        </div>
    </div>
  )
}

export default ExplicTimeCard
