import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { gestorAuth } from '../../constants/gestorAuth'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import AddExplicacaoModal from '../Modals/GestorExplicacoes/AddExplicacaoModal'
import EditExplicacaoModal from '../Modals/GestorExplicacoes/EditExplicacaoModal'
import ChooseMonthModal from '../Modals/ChooseMonthModal'
import ChooseDayModal from '../Modals/ChooseDayModal'
import ChooseWeekModal from '../Modals/ChooseWeekModal'
import { endOfWeek, isSameDay, isSameMonth, isSameWeek, startOfWeek } from 'date-fns'

function GestorExplicacoes() {
  const {loading, explicacoes, getAllExplicacoes, setNewExplicacao, setEditIDexplicacao, deleteExplicacao, getAllExplicadores, getAllExplicandos, getAllDisciplinas} = gestorAuth()
  const [pesquisaDisciplina, setPesquisaDisciplina] = useState("")
  const [pesquisaExplicador, setPesquisaExplicador] = useState("")
  const [pesquisaExplicando, setPesquisaExplicando] = useState("")
  const [filtroDatas, setFiltroDatas] = useState("todas")
  const [filtroRecorrentes, setFiltroRecorrentes] = useState("todas")
  const [filtroDiaSemana, setFiltroDiaSemana] = useState("todas")
  const [dia, setDia] = useState(new Date())
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllExplicacoes()
    getAllExplicadores()
    getAllExplicandos()
    getAllDisciplinas()
  }, [])

  const inicioSemana = startOfWeek(dia, {
    weekStartsOn: 0
  })
  const fimSemana = endOfWeek(dia)

  //Formatar dias
  const formatDia = (data) => {
    if (!data) return "-"
    return data.slice(8, 10) + "/" + data.slice(5, 7) + "/" + data.slice(0, 4)
  }

  //Formatar horas
  const formatHora = (data) => {
    if (!data) return "-"
    return data.slice(11, 16)
  }

  const explicacoesFiltradas = explicacoes.filter((exp) => {
    const disciplinaFilter = exp.nome_disciplina?.toLowerCase().includes(pesquisaDisciplina.toLowerCase())

    const explicadorFilter = exp.nome_explicador?.toLowerCase().includes(pesquisaExplicador.toLowerCase())

    const explicandoFilter = exp.nome_explicando?.toLowerCase().includes(pesquisaExplicando.toLowerCase())

    return disciplinaFilter && explicadorFilter && explicandoFilter
  }).filter((exp) => {
    const dataExplicacao = new Date(exp.data_inicio)
    
    switch (filtroDatas){
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
  }).filter((exp) => {
    switch(filtroRecorrentes){
      case 'recorrentesOriginais':
        return exp.repete_mensal
      case 'recorrentesCopias':
        return (!exp.repete_mensal && exp.origem_recorrencia_id)
      case 'naorecorrentes':
        return (!exp.repete_mensal && !exp.origem_recorrencia_id)
      case 'todas':
        return true
    }
  }).filter((exp) => {
    const diaSemana = new Date(exp.data_inicio).getDay()

    switch (filtroDiaSemana){
      case 'domingo':
        return (diaSemana == 0)
      case 'segunda':
        return (diaSemana == 1)
      case 'terca':
        return (diaSemana == 2)
      case 'quarta':
        return (diaSemana == 3)
      case 'quinta':
        return (diaSemana == 4)
      case 'sexta':
        return (diaSemana == 5)
      case 'sabado':
        return (diaSemana == 6)
      case 'todas':
        return true
    }
  })

  const stats = explicacoesFiltradas.reduce(
    (total, exp) => {
      total.total += 1

      if (exp.lecionada) {
        total.lecionadas += 1
      } else {
        total.pendentes += 1
      }

      return total
    },
    {
      total: 0,
      lecionadas: 0,
      pendentes: 0
    }
  )

  const handleEdit = (exp) => {
    setNewExplicacao({
      data_inicio: exp.data_inicio,
      data_fim: exp.data_fim,
      lecionada: exp.lecionada,
      descricao: exp.descricao,
      repete_mensal: exp.repete_mensal,
      origem_recorrencia_id: exp.origem_recorrencia_id,
      id_explicador: exp.id_explicador,
      id_disciplina: exp.id_disciplina,
      id_explicando: exp.id_explicando
    })

    setEditIDexplicacao(exp.id_explicacao)
    document.getElementById("editExplicacaoModal").showModal()
  }

  const limparPesquisas = () => {
    setPesquisaDisciplina("")
    setPesquisaExplicador("")
    setPesquisaExplicando("")
    setFiltroDatas("todas")
    setFiltroRecorrentes("todas")
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className="card-body">

        <div className="grid grid-cols-2 gap-4 mb-2">
          <h2 className="text-xl font-semibold">
            Explicações
          </h2>

          <div className="flex justify-end">
            {/* Botao de adicionar explicacao unica */}
            <button className="btn btn-primary rounded-full" onClick={() => document.getElementById("addExplicacaoModal").showModal()}>
              <PlusCircleIcon className="size-5" />
              Adicionar Explicação
            </button>
          </div>
        </div>

        <div className="stats shadow w-full mb-4">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Lecionadas</div>
            <div className="stat-value text-success">{stats.lecionadas}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Pendentes</div>
            <div className="stat-value text-warning">{stats.pendentes}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-2">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="size-4" />
            <input
              type="text"
              className="grow"
              placeholder="Pesquisar disciplina..."
              value={pesquisaDisciplina}
              onChange={(e) => setPesquisaDisciplina(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <Search className="size-4" />
            <input
              type="text"
              className="grow"
              placeholder="Pesquisar explicador..."
              value={pesquisaExplicador}
              onChange={(e) => setPesquisaExplicador(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <Search className="size-4" />
            <input
              type="text"
              className="grow"
              placeholder="Pesquisar explicando..."
              value={pesquisaExplicando}
              onChange={(e) => setPesquisaExplicando(e.target.value)}
            />
          </label>

          <button className='btn btn-primary' onClick={limparPesquisas}>
            Limpar
          </button>
        </div>

        <div className='flex justify-start ml-4'>
          <h3 className='flex items-center mr-4'>Filtrar por:</h3>
          {/* Botoes de filtrar por datas de explicacao*/}
          <button className={`btn mr-4 ${(filtroDatas !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroDatas'>
            Data da Explic.
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroDatas'>
            <li><button className={`btn btn-sm ${(filtroDatas === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroDatas('todas')}>
              Todas
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'dia') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('dia');
              document.getElementById("chooseDayModal").showModal()}}>
              Ver Dia
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('semana');
              document.getElementById("chooseWeekModal").showModal()}}>
              Ver Semana
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('mes');
              document.getElementById("chooseMonthModal").showModal()}}>
              Ver Mês
            </button></li>
          </ul>

          {/* Botoes de filtrar por explicacoes recorrentes */}
          <button className={`btn mr-4 ${(filtroRecorrentes !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroRecorrente'>
            Recorrentes
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroRecorrente'>
            <li><button className={`btn btn-sm ${(filtroRecorrentes === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroRecorrentes('todas')}>
              Todas
            </button></li>

            <li><button className={`btn btn-sm ${(filtroRecorrentes === 'recorrentesOriginais') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroRecorrentes('recorrentesOriginais')}}>
              Ver Recorrentes Originais
            </button></li>

            <li><button className={`btn btn-sm ${(filtroRecorrentes === 'recorrentesCopias') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroRecorrentes('recorrentesCopias')}}>
              Ver Recorrentes Cópias
            </button></li>

            <li><button className={`btn btn-sm ${(filtroRecorrentes === 'naorecorrentes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroRecorrentes('naorecorrentes')}}>
              Ver Só Não Recorrentes
            </button></li>
          </ul>

          {/* Botoes de filtrar por dias da semana */}
          <button className={`btn mr-4 ${(filtroDiaSemana !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroDiaSemana'>
            Dia Semana
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroDiaSemana'>
            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroDiaSemana('todas')}>
              Todas
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'domingo') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('domingo')}}>
              Domingo
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'segunda') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('segunda')}}>
              Segunda
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'terca') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('terca')}}>
              Terça
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'quarta') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('quarta')}}>
              Quarta
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'quinta') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('quinta')}}>
              Quinta
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'sexta') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('sexta')}}>
              Sexta
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDiaSemana === 'sabado') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroDiaSemana('sabado')}}>
              Sábado
            </button></li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra table-fixed w-full">
              <thead>
                <tr>
                  <th className="w-25">Data</th>
                  <th className="w-25">Hora</th>
                  <th className="w-40">Disciplina</th>
                  <th className="w-30">Explicador</th>
                  <th className="w-30">Explicando</th>
                  <th className="w-20">Lecionada</th>
                  <th className='w-20'>Recorrente</th>
                  <th className="w-28"></th>
                </tr>
              </thead>

              <tbody>
                {explicacoesFiltradas.map((exp) => (
                  <tr key={exp.id_explicacao}>
                    <td className="truncate">{formatDia(exp.data_inicio)}</td>
                    <td className="truncate">
                      {formatHora(exp.data_inicio)} - {formatHora(exp.data_fim)}
                    </td>
                    <td className="truncate">{exp.nome_disciplina} ({exp.ano}º)</td>
                    <td className="truncate">{exp.nome_explicador}</td>
                    <td className="truncate">{exp.nome_explicando}</td>
                    <td>
                      {exp.lecionada ? (
                        <span className="badge badge-success">Lecionada</span>
                      ) : (
                        <span className="badge badge-warning">Pendente</span>
                      )}
                    </td>
                    <td>
                      {exp.repete_mensal && (
                        <span className="badge badge-primary">Original</span>
                      )}
                      {!exp.repete_mensal && exp.origem_recorrencia_id && (
                        <span className="badge badge-primary">Cópia</span>
                      )}
                      {}
                      {!exp.origem_recorrencia_id && !exp.repete_mensal && (
                        <span className="badge badge-outline">Não</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(exp)}>
                          <SquarePen className="size-4" />
                        </button>

                        <button className="btn btn-error btn-sm" onClick={() => {
                            setExpDel(exp)
                            document.getElementById("confirmDeleteModal").showModal()
                          }}>
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modais */}
      <ChooseDayModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
      <ChooseWeekModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
      <ChooseMonthModal onSelectDia={(selectDia) => {setDia(selectDia)}}/>
      <AddExplicacaoModal />
      <EditExplicacaoModal />
      <ConfirmDeleteModal titulo={`a explicação de ${expDel?.disciplina_nome || ""}`} onConfirm={() => deleteExplicacao(expDel?.id_explicacao)}/>
    </div>
  )
}

export default GestorExplicacoes
