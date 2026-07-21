import React, { useEffect, useState } from 'react'
import ChooseDayModal from '../Modals/ChooseDayModal'
import ChooseWeekModal from '../Modals/ChooseWeekModal'
import ChooseMonthModal from '../Modals/ChooseMonthModal'
import { isSameDay, isSameWeek, isSameMonth, startOfWeek, addDays, endOfWeek } from 'date-fns'
import { useAuthStore } from '../../constants/useAuthStore'
import { CreditCard, Eye, Trash2 } from 'lucide-react'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import EncomendaProductsModal from '../Modals/EncomendaProductsModal'

function StoreUserEncomendas() {
  const {loading, userStore, encomendas, checkUserStore, getAllEncomendasByUser, deleteEncomenda, getProdutosEncomenda, getEncomendaByID} = useAuthStore()
  {/* Variaveis para filtros */}
  const [filtro, setFiltro] = useState('todas');
  const [dia, setDia] = useState(new Date());
  const [filtroPagamento, setFiltroPagamento] = useState('todas');
  const [diaPagamento, setDiaPagamento] = useState(new Date());
  const [chooseFiltro, setChooseFiltro] = useState("")
  const [filtroEstadoEnc, setFiltroEstadoEnc] = useState('todas')
  const [filtroEstadoPag, setFiltroEstadoPag] = useState('todas')
  const [encDel, setEncDel] = useState(null)
  useEffect(() => {
    checkUserStore()
    getAllEncomendasByUser()
  },[])
  const inicioSemana = startOfWeek(dia, {
    weekStartsOn: 0
  })
  const fimSemana = endOfWeek(dia)
  const inicioSemanaPaga = startOfWeek(diaPagamento, {
    weekStartsOn: 0
  })
  const fimSemanaPaga = endOfWeek(diaPagamento)

  //Funcao para aplicar filtro de encomendas a mostrar
  const encFilter = encomendas.filter((enc) => {
    const dataEncomenda = new Date(enc.data_encomenda)

    switch (filtro){
      case 'dia':
        return isSameDay(dataEncomenda, dia)
      case 'semana':
        {/* Verificar se o weekStartsOn fica no 1 ou 0 (Verificar ISO usado) */}
        return isSameWeek(dataEncomenda, dia, {weekStartsOn: 0}) 
      case 'mes':
        return isSameMonth(dataEncomenda, dia)
      case 'todas':
        return true
    }
  }).filter((enc) => {
    const dataPagamento = new Date(enc.data_pagamento)

    switch (filtroPagamento){
      case 'dia':
        if(enc.data_pagamento == null){
          return false
        }
        return isSameDay(dataPagamento, diaPagamento)
      case 'semana':
        if(enc.data_pagamento == null){
          return false
        }
        {/* Verificar se o weekStartsOn fica no 1 ou 0 (Verificar ISO usado) */}
        return isSameWeek(dataPagamento, diaPagamento, {weekStartsOn: 0}) 
      case 'mes':
        if(enc.data_pagamento == null){
          return false
        }
        return isSameMonth(dataPagamento, diaPagamento)
      case 'todas':
        return true
    }
  }).filter((enc) => {
    if(filtroEstadoEnc == "todas"){
      return true
    }else if(filtroEstadoEnc == "pendente" && enc.estado == "pendente"){
      return true
    }else if(filtroEstadoEnc == "pronta" && enc.estado == "pronta"){
      return true
    }else if(filtroEstadoEnc == "levantada" && enc.estado == "levantada"){
      return true
    }else if(filtroEstadoEnc == "cancelada" && enc.estado == "cancelada"){
      return true
    }

    return false
  }).filter((enc) => {
    if(filtroEstadoPag == "todas"){
      return true
    }else if(filtroEstadoPag == "pendente" && enc.estado_pagamento == "pendente"){
      return true
    }else if(filtroEstadoPag == "expirado" && enc.estado_pagamento == "expirado"){
      return true
    }else if(filtroEstadoPag == "pago" && enc.estado_pagamento == "pago"){
      return true
    }else if(filtroEstadoPag == "falhado" && enc.estado_pagamento == "falhado"){
      return true
    }

    return false
  })

  //Funcao de escrita do filtro da data de encomenda
  const drawFiltro = () => {
    if(filtro === 'todas'){
      return (
        <></>
      )
    }else if(filtro === 'dia'){
      return (
        <h2 className='text-xl font-semibold'>
          Encomendas do dia {dia.getDate()}/{dia.getMonth()+1}/{dia.getFullYear()}
        </h2>
      )
    }else if(filtro === 'semana'){
      return (
        <h2 className='text-xl font-semibold'>
          Encomendas da semana {inicioSemana.getDate()}/{inicioSemana.getMonth()+1}/{inicioSemana.getFullYear()} - {fimSemana.getDate()}/{fimSemana.getMonth()+1}/{fimSemana.getFullYear()}
        </h2>
      )
    }else if(filtro === 'mes'){
      return (
        <h2 className='text-xl font-semibold'>
          Encomendas do mês {dia.getMonth()+1}/{dia.getFullYear()}
        </h2>
      )
    }
  }

  //Funcao de escrita do filtro da data de pagamento
  const drawFiltroPagamento = () => {
    if(filtroPagamento === 'todas'){
      return (
        <></>
      )
    }else if(filtroPagamento === 'dia'){
      return (
        <h2 className='text-xl font-semibold'>
          Pagamentos do dia {diaPagamento.getDate()}/{diaPagamento.getMonth()+1}/{diaPagamento.getFullYear()}
        </h2>
      )
    }else if(filtroPagamento === 'semana'){
      return (
        <h2 className='text-xl font-semibold'>
          Pagamentos da semana {inicioSemanaPaga.getDate()}/{inicioSemanaPaga.getMonth()+1}/{inicioSemanaPaga.getFullYear()} - {fimSemanaPaga.getDate()}/{fimSemanaPaga.getMonth()+1}/{fimSemanaPaga.getFullYear()}
        </h2>
      )
    }else if(filtroPagamento === 'mes'){
      return (
        <h2 className='text-xl font-semibold'>
          Pagamentos do mês {diaPagamento.getMonth()+1}/{diaPagamento.getFullYear()}
        </h2>
      )
    }
  }

  //Formatar dias
  const formatDia = (data) => {
    if (!data) return "-"
    return data.slice(8, 10) + "/" + data.slice(5, 7) + "/" + data.slice(0, 4)
  }

  //Interacao do botao de ver encomenda
  const handleView = async (enc) => {
    await getEncomendaByID(enc.id_encomenda)
    await getProdutosEncomenda()
    document.getElementById("encomendaProductsModal").showModal()
  }

  //Interacao do botao de pagar encomenda
  const handlePay = async (enc) => {
    //Por implementar
  }

  return (
    <div className='card bg-base-100 shadow-lg'>
      <div className='card-body'>
        <section>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <h2 className='text-xl font-semibold'>
              Encomendas Feitas
            </h2>

            <div className='flex justify-end'>
              <h3 className='flex items-center mr-4'>Filtrar por:</h3>
              <button className={`btn mr-2 ${(filtro !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroExplic'>
                Data Encomenda
              </button>
              <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroExplic'>
                {/* Botoes de filtrar por datas de encomenda */}
                
                <li><button className={`btn btn-sm ${(filtro === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltro('todas')}>
                  Todas
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'dia') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('dia');
                  setChooseFiltro('encomenda');
                  document.getElementById("chooseDayModal").showModal()}}>
                  Ver Dia
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('semana');
                  setChooseFiltro('encomenda');
                  document.getElementById("chooseWeekModal").showModal()}}>
                  Ver Semana
                </button></li>

                <li><button className={`btn btn-sm ${(filtro === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltro('mes');
                  setChooseFiltro('encomenda');
                  document.getElementById("chooseMonthModal").showModal()}}>
                  Ver Mês
                </button></li>
              </ul>

              <button className={`btn mr-2 ${(filtroPagamento !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroPaga'>
                Data Pagamento
              </button>
              <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroPaga'>
                {/* Botoes de filtrar por datas de pagamento */}
                
                <li><button className={`btn btn-sm ${(filtroPagamento === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroPagamento('todas')}>
                  Todas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroPagamento === 'dia') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltroPagamento('dia');
                  setChooseFiltro('pagamento');
                  document.getElementById("chooseDayModal").showModal()}}>
                  Ver Dia
                </button></li>

                <li><button className={`btn btn-sm ${(filtroPagamento === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltroPagamento('semana');
                  setChooseFiltro('pagamento');
                  document.getElementById("chooseWeekModal").showModal()}}>
                  Ver Semana
                </button></li>

                <li><button className={`btn btn-sm ${(filtroPagamento === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
                  setFiltroPagamento('mes');
                  setChooseFiltro('pagamento');
                  document.getElementById("chooseMonthModal").showModal()}}>
                  Ver Mês
                </button></li>
              </ul>

              <button className={`btn mr-2 ${(filtroEstadoEnc !== 'todas' || filtroEstadoPag !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroEstados'>
                Estados
              </button>
              <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroEstados'>
                
                {/* Botoes de filtrar por estados de encomenda/pagamento */}
                <li className='flex items-center menu-title'>
                    <span>Estado Encomendas:</span>
                </li>
                <li><button className={`btn btn-sm ${(filtroEstadoEnc === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroEstadoEnc('todas')}>
                  Todas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoEnc === 'pendente') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoEnc('pendente');}}>
                  Pendentes
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoEnc === 'pronta') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoEnc('pronta');}}>
                  Prontas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoEnc === 'levantada') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoEnc('levantada');}}>
                  Expiradas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoEnc === 'cancelada') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoEnc('cancelada');}}>
                  Canceladas
                </button></li>

                <li className='flex items-center menu-title'>
                    <span>Estado Pagamentos:</span>
                </li>
                <li><button className={`btn btn-sm ${(filtroEstadoPag === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroEstadoPag('todas')}>
                  Todas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoPag === 'pendente') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoPag('pendente');}}>
                  Pendentes
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoPag === 'expirado') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoPag('expirado');}}>
                  Expiradas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoPag === 'pago') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoPag('pago');}}>
                  Pagas
                </button></li>

                <li><button className={`btn btn-sm ${(filtroEstadoPag === 'falhado') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroEstadoPag('falhado');}}>
                  Falhadas
                </button></li>
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
                {drawFiltro()}
                {drawFiltroPagamento()}
                
                <div className='overflow-x-auto'>
                  {/* Tabela dos explicadores a mostrar */}
                  <table className='table table-zebra table-fixed w-full'>
                    <thead>
                      <tr>
                        <th className='w-30'>Estado Encom.</th>
                        <th className='w-20'>Total</th>
                        <th className='w-30'>Data Encom.</th>
                        <th className='w-30'>Estado Pagam.</th>
                        <th className='w-30'>Data Pagam.</th>
                        <th className='w-70'>Observações</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {encFilter.map(enc => (
                        <tr key={enc.id_encomenda}>
                          <td className='truncate'>
                            {(enc.estado == "pendente") && (
                              <span className="badge badge-warning">Pendente</span>
                            )}
                            {(enc.estado == "pronta") && (
                              <span className="badge badge-primary">Pronta</span>
                            )}
                            {(enc.estado == "levantada") && (
                              <span className="badge badge-success">Levantada</span>
                            )}
                            {(enc.estado == "cancelada") && (
                              <span className="badge badge-error">Cancelada</span>
                            )}
                          </td>
                          <td className='truncate'>{enc.total}€</td>
                          <td className='truncate'>{formatDia(enc.data_encomenda)}</td>
                          <td className='truncate'>
                            {(enc.estado_pagamento == "pendente") && (
                              <span className="badge badge-warning">Pendente</span>
                            )}
                            {(enc.estado_pagamento == "expirado") && (
                              <span className="badge badge-primary">Expirado</span>
                            )}
                            {(enc.estado_pagamento == "pago") && (
                              <span className="badge badge-success">Pago</span>
                            )}
                            {(enc.estado_pagamento == "falhado") && (
                              <span className="badge badge-error">Falhado</span>
                            )}
                            </td>
                          <td className='truncate'>{formatDia(enc.data_pagamento)}</td>
                          <td className='truncate'>{(enc.observacoes == null) ? (
                            "-"
                          ) : (
                            enc.observacoes
                          )}</td>
                          <td>
                            <div className='flex gap-2'>
                              {/* Botao de editar */}
                              <button className='btn btn-primary btn-sm' onClick={() => handleView(enc)}>
                                <Eye className='size-4' /> Abrir
                              </button>
                              {/* Botao de pagar */}
                              <button className='btn btn-success btn-sm' onClick={() => handlePay(enc)}>
                                <CreditCard className='size-4' /> Pagar
                              </button>
                              {/* Botao de eliminar */}
                              <button className='btn btn-error btn-sm' onClick={() => {
                                setEncDel(enc)
                                document.getElementById("confirmDeleteModal").showModal()
                              }}>
                                <Trash2 className='size-4' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>


      {/* Modais para filtros */}
      <ChooseDayModal onSelectDia={(selectDia) => {
        if(chooseFiltro === 'pagamento'){
          setDiaPagamento(selectDia)
        } else {
          setDia(selectDia)
        }
        setChooseFiltro("")
      }}/>
      <ChooseWeekModal onSelectDia={(selectDia) => {
        if(chooseFiltro === 'pagamento'){
          setDiaPagamento(selectDia)
        } else {
          setDia(selectDia)
        }
        setChooseFiltro("")
      }}/>
      <ChooseMonthModal onSelectDia={(selectDia) => {
        if(chooseFiltro === 'pagamento'){
          setDiaPagamento(selectDia)
        } else {
          setDia(selectDia)
        }
        setChooseFiltro("")
      }}/>
      <ConfirmDeleteModal titulo={"esta encomenda"} onConfirm={() => deleteEncomenda(encDel?.id_encomenda)} />
      <EncomendaProductsModal />
    </div>
  )
}

export default StoreUserEncomendas
