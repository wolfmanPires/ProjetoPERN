import React, { useEffect } from 'react';
import { useState } from "react";
import { CalendarWeek, DayPicker, rangeIncludesDate } from "react-day-picker";
import "react-day-picker/style.css";
import { pt } from "react-day-picker/locale";
import { Check, X } from 'lucide-react';
import ExplicTimeCard from '../components/ExplicTimeCard';
import { useAuth } from '../constants/useAuth';
import { isSameDay, isSameWeek, startOfWeek, endOfWeek } from "date-fns";
import EditExplicModal from '../components/Modals/EditExplicModal';
import WeekCalendar from '../components/CalendariosCustom/WeekCalendar';
import ChoosePessoaModal from '../components/Modals/choosePessoaModal';

function CalendarHomePage() {
  const [selected, setSelected] = useState(new Date());
  const agora = new Date();
  const [selectedWeek, setSelectedWeek] = useState();
  const [filtro, setFiltro] = useState("")
  const {loading, explicData, checkExplicacoes, user} = useAuth();
  useEffect(() => {
    checkExplicacoes()
  },[])
  const explicDoDia = explicData.filter(explic => isSameDay(new Date(explic.data_inicio),selected)).filter(explic => {
    if (!filtro) return true

    return explic.nome === filtro
  })
  const explicSemana = explicData.filter((explic) => {
    const dataExplicacao = new Date(explic.data_inicio)
    return isSameWeek(dataExplicacao, selected, {weekStartsOn: 0}) 
  }).filter(explic => {
    if (!filtro) return true

    return explic.nome === filtro
  })

  //Funcao que escreve introdução ao utilizador, dependente da hora do dia
  const greeting = () => {
    if(agora.getHours()>=6 && agora.getHours()<12){
      return `Bom dia ${user.nome}!`
    }else if(agora.getHours()>=12 && agora.getHours()<19){
      return `Boa tarde ${user.nome}!`
    }else{
      return `Boa noite ${user.nome}!`
    }
  }

  //Funcao para lidar com o filtro do explicando/explicador
  const allPessoas = [...new Set(
    explicData.map(explic => explic.nome)
  )]
  const resolveFiltro = () => {
    if(filtro !== ''){
      setFiltro('')
    }else{
      document.getElementById("choosePessoaModal").showModal()
    }
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-2 gap-4 w-full mb-4'>
        <h1 className='text-xl font-bold'>
          {greeting()}
        </h1>

        <div className='flex justify-end'>
          <button className={`btn btn-sm ${(filtro !== '') ? ('btn-primary') : ('btn-outline')}`} onClick={resolveFiltro}>
            {filtro !== '' && "Remover Filtro"}
            {user.tipo === "explicador" && filtro === '' && "Filtrar por Explicando"}
            {user.tipo === "explicando" && filtro === '' && "Filtrar por Explicador"}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 w-full bg-base-100 mb-4'>
        <WeekCalendar dia={selected} explicList={explicSemana}/>
      </div>

      {/* Centrar componentes de forma a funcionar para desktop e mobile */}
        <div className='grid grid-cols-1 lg:grid-cols-[350px_auto_1fr] gap-4'>
          {/* Componente de calendario */}
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
                setSelected(day)
                setSelectedWeek({
                  from: startOfWeek(day),
                  to: endOfWeek(day)
              })
            }}                
          />

          {/* Divisor vertical da pagina */}
          <div className='divider divider-horizontal divider-primary' />

          <div className='flex flex-col items-center w-full'>
            <div className='menu-title text-base-content'>
              {selected ? `Selecionado: ${selected.toLocaleDateString()}` : "Escolhe o dia."}
            </div>

            <div className='w-full'>
              {/* Area para inserir cards de explicacoes */}
              {loading ? (
                <div className='flex justify-center items-center h-64'>
                  <div className='loading loading-spinner loading-lg' />
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full'>
                  {explicDoDia.map(explic => (
                    <ExplicTimeCard key={explic.id_explicacao} explicacao={explic} page={"CalendarHomePage"}/>
                  ))}
                </div>
              )}
            </div>


          </div>
          <EditExplicModal />{/*<EditExplicModal explicacao={explicacao} />*/}  
          <ChoosePessoaModal listPessoas={allPessoas} onSelectPessoa={(selectPessoa) => {setFiltro(selectPessoa)}}/>
        </div>
    </main>
  );
}

export default CalendarHomePage
