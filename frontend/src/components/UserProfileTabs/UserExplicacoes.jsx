import React, { useEffect, useState } from 'react'
import { useAuth } from '../../constants/useAuth'
import ExplicTimeCard from '../ExplicTimeCard'
import { isSameDay, isSameWeek, isSameMonth, startOfWeek, addDays, endOfWeek } from 'date-fns'
import WeekCalendar from '../CalendariosCustom/WeekCalendar'
import ChooseDayModal from '../Modals/ChooseDayModal'
import ChooseWeekModal from '../Modals/ChooseWeekModal'
import ChooseMonthModal from '../Modals/ChooseMonthModal'
import ChoosePessoaModal from '../Modals/ChoosePessoaModal'
import EditExplicModal from '../Modals/EditExplicModal'

function UserExplicacoes() {
  const {loading, user, extraData, getProfileData, explicData, checkExplicacoes} = useAuth()
  {/* Variaveis para filtros */}
  const [filtro, setFiltro] = useState('todas');
  const [filtroPessoa, setFiltroPessoa] = useState('');
  const allPessoas = [...new Set(
    explicData.map(explic => explic.nome)
  )]
  const [dia, setDia] = useState(new Date());
  useEffect(() => {
    checkExplicacoes()
    getProfileData()
  },[])
  const inicioSemana = startOfWeek(dia, {
    weekStartsOn: 0
  })
  const fimSemana = endOfWeek(dia)

  //Funcao para aplicar filtro de explicacoes a mostrar
  const explicFilter = explicData.filter((explic) => {
    const dataExplicacao = new Date(explic.data_inicio)

    switch (filtro){
      case 'dia':
        return isSameDay(dataExplicacao, dia)
      case 'semana':
        {/* Verificar se o weekStartsOn fica no 1 ou 0 (Verificar ISO usado) */}
        return isSameWeek(dataExplicacao, dia, {weekStartsOn: 0}) 
      case 'mes':
        return isSameMonth(dataExplicacao, dia)
      case 'todas':
        return true
    }
  }).filter(explic => {
    if (!filtroPessoa) return true

    return explic.nome === filtroPessoa
  })

  //Funcao de escrita das componentes a desenhar
  const drawExplic = () => {
    if(filtro === 'todas'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            {filtroPessoa !== "" && ` Para ${filtroPessoa}`}
          </h2>
          
          {explicFilter.map(explic => (
            <ExplicTimeCard key={explic.id_explicacao} explicacao={explic} page={"UserExplicacoes"}/>
          ))}
        </div>
      )
    }else if(filtro === 'dia'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Para o dia {dia.getDate()}/{dia.getMonth()+1}/{dia.getFullYear()}
            {filtroPessoa !== "" && ` e para ${filtroPessoa}`}
          </h2>
          {explicFilter.map(explic => (
            <ExplicTimeCard key={explic.id_explicacao} explicacao={explic} page={"UserExplicacoes"}/>
          ))}
        </div>
      )
    }else if(filtro === 'semana'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Para a semana {inicioSemana.getDate()}/{inicioSemana.getMonth()+1}/{inicioSemana.getFullYear()} - {fimSemana.getDate()}/{fimSemana.getMonth()+1}/{fimSemana.getFullYear()}
            {filtroPessoa !== "" && ` e para ${filtroPessoa}`}
          </h2>
          <WeekCalendar dia={dia} explicList={explicFilter}/>
        </div>
      )
    }else if(filtro === 'mes'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Para o mês {dia.getMonth()+1}/{dia.getFullYear()}
            {filtroPessoa !== "" && ` e para ${filtroPessoa}`}
          </h2>
          {explicFilter.map(explic => (
            <ExplicTimeCard key={explic.id_explicacao} explicacao={explic} page={"UserExplicacoes"}/>
          ))}
        </div>
      )
    }
  }

  return (
    <div className='card bg-base-100 shadow-lg'>
      <div className='card-body'>
        <section>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <h2 className='text-xl font-semibold'>
              Explicações
            </h2>

            <div className='flex justify-end'>
              <button className='btn' popoverTarget='dropdownFiltroExplic'>
                Filtrar
              </button>
              <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroExplic'>
                {/* Botoes de filtrar por datas */}
                <li className='flex items-center menu-title'>
                    <span>Por Datas:</span>
                </li>
                <li><button className={`btn btn-sm ${(filtro === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltro('todas')}>
                  Todas
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'dia') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('dia');
                  document.getElementById("chooseDayModal").showModal()}}>
                  Ver Dia
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('semana');
                  document.getElementById("chooseWeekModal").showModal()}}>
                  Ver Semana
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('mes');
                  document.getElementById("chooseMonthModal").showModal()}}>
                  Ver Mês
                </button></li>

                {/* Botao de filtrar por explicando, quando user e Explicador */}
                {user.tipo === 'explicador' && (
                  <div className='w-full'>
                    <li className='flex items-center menu-title'>
                      <span>Por Explicando:</span>
                    </li>

                    <li><button className={`btn btn-sm ${(filtroPessoa === '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPessoa('');}}>
                      Todos Explicandos
                    </button></li>

                    <li><button className={`btn btn-sm ${(filtroPessoa !== '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {document.getElementById("choosePessoaModal").showModal()}}>
                      Procurar Explicando
                    </button></li>
                  </div>
                )}

                {/* Botao de filtrar por explicador, quando user e Explicando */}
                {user.tipo === 'explicando' && (
                  <div className='w-full'>
                    <li className='flex items-center menu-title'>
                      <span>Por Explicador:</span>
                    </li>

                    <li><button className={`btn btn-sm ${(filtroPessoa === '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPessoa('');}}>
                      Todos Explicadores
                    </button></li>

                    <li><button className={`btn btn-sm ${(filtroPessoa !== '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {document.getElementById("choosePessoaModal").showModal()}}>
                      Procurar Explicador
                    </button></li>
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className='grid gap-4'>
            {loading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='loading loading-spinner loading-lg' />
              </div>
            ) : (
              <div className='w-full'>
                {drawExplic()}
              </div>
            )}

          </div>
        </section>

        {/* Modais para filtros */}
        <ChooseDayModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
        <ChooseWeekModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
        <ChooseMonthModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
        <ChoosePessoaModal listPessoas={allPessoas} onSelectPessoa={(selectPessoa) => {setFiltroPessoa(selectPessoa)}}/>
        <EditExplicModal />
      </div>
    </div>
  )
}

export default UserExplicacoes
