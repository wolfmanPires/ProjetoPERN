import { PlusCircleIcon, SquarePen, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { gestorAuth } from '../../constants/gestorAuth';
import ChooseMonthModal from '../Modals/ChooseMonthModal';
import { endOfWeek, isSameMonth, isSameWeek, isSameYear, startOfWeek } from 'date-fns';
import ChoosePessoaModal from '../Modals/ChoosePessoaModal';
import ChooseWeekModal from '../Modals/ChooseWeekModal';
import AddPagamentoModal from '../Modals/GestorPagamentos/AddPagamentoModal';
import EditPagamentoModal from '../Modals/GestorPagamentos/EditPagamentoModal';
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal';

function GestorPagamentos() {
  const {loading, pagamentos, setNewPagamento, getAllPagamentos, deletePagamento, setEditIDpagamento, getAllUsersLimit} = gestorAuth()
  const [filtroDatas, setFiltroDatas] = useState('todas')
  const [filtroDatasPagamento, setFiltroDatasPagamento] = useState('todas')
  const [chooseFiltro, setChooseFiltro] = useState("")
  const [filtroUser, setFiltroUser] = useState('')
  const [expDel, setExpDel] = useState("")
  const [filtroPagar, setFiltroPagar] = useState('todas')

  const allPessoas = [...new Set(
    pagamentos.map(paga => paga.nome)
  )]
  const [dia, setDia] = useState(new Date());
  const [diaPago, setDiaPago] = useState(new Date());
  useEffect(() => {
    getAllPagamentos()
    getAllUsersLimit()
  },[])
  const inicioSemana = startOfWeek(dia, {
    weekStartsOn: 0
  })
  const fimSemana = endOfWeek(dia)
  const inicioSemanaPago = startOfWeek(diaPago, {
    weekStartsOn: 0
  })
  const fimSemanaPago = endOfWeek(diaPago)

  //Funcao para aplicar filtro de pagamentos a mostrar
  const pagaFilter = pagamentos.filter((paga) => {
    const dataExplicacao = new Date(paga.data_vencimento)

    switch (filtroDatas){
      case 'ano':
        return isSameYear(dataExplicacao, dia)
      case 'semana':
        {/* Verificar se o weekStartsOn fica no 1 ou 0 (Verificar ISO usado) */}
        return isSameWeek(dataExplicacao, dia, {weekStartsOn: 0}) 
      case 'mes':
        return isSameMonth(dataExplicacao, dia)
      case 'todas':
        return true
    }
  }).filter(paga => {
    if (!filtroUser) return true

    return paga.nome === filtroUser
  }).filter((paga) => {
    const dataExplicacao = new Date(paga.data_pago)

    switch (filtroDatasPagamento){
      case 'ano':
        return isSameYear(dataExplicacao, diaPago)
      case 'semana':
        {/* Verificar se o weekStartsOn fica no 1 ou 0 (Verificar ISO usado) */}
        return isSameWeek(dataExplicacao, diaPago, {weekStartsOn: 0}) 
      case 'mes':
        return isSameMonth(dataExplicacao, diaPago)
      case 'todas':
        return true
    }
  }).filter((paga) => {
    switch(filtroPagar){
      case 'todas':
        return true
      case 'pagos':
        return (paga.data_pago !== null)
      case 'porPagar':
        return (paga.data_pago === null)
    }
  })

  //Funcao de escrita das componentes a desenhar
  const drawTitulo = () => {
    if(filtroDatas === 'todas'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            {filtroUser !== "" && `Para ${filtroUser}`}
            {filtroDatasPagamento !== "todas" ? (` - ${drawTituloPaga()}`) : ("")}
          </h2>
        </div>
      )
    }else if(filtroDatas === 'ano'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Vencimentos para o ano {dia.getFullYear()}
            {filtroDatasPagamento !== "todas" ? (` - ${drawTituloPaga()}`) : ("")}
            {filtroUser !== "" && ` e para ${filtroUser}`}
          </h2>
        </div>
      )
    }else if(filtroDatas === 'semana'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Vencimentos para a semana {inicioSemana.getDate()}/{inicioSemana.getMonth()+1}/{inicioSemana.getFullYear()} - {fimSemana.getDate()}/{fimSemana.getMonth()+1}/{fimSemana.getFullYear()}
            {filtroDatasPagamento !== "todas" ? (` - ${drawTituloPaga()}`) : ("")}
            {filtroUser !== "" && ` e para ${filtroUser}`}
          </h2>
        </div>
      )
    }else if(filtroDatas === 'mes'){
      return (
        <div className='grid grid-cols-1 gap-4 w-full'>
          <h2 className='text-xl font-semibold'>
            Vencimentos para o mês {dia.getMonth()+1}/{dia.getFullYear()}
            {filtroDatasPagamento !== "todas" ? (` - ${drawTituloPaga()}`) : ("")}
            {filtroUser !== "" && ` e para ${filtroUser}`}
          </h2>
        </div>
      )
    }
  }

  const drawTituloPaga = () => {
    if(filtroDatasPagamento === 'todas'){
      return (``)
    }else if(filtroDatasPagamento === 'ano'){
      return (`Pagamentos para o ano ${diaPago.getFullYear()}`)
    }else if(filtroDatasPagamento === 'semana'){
      return (`Pagamentos para a semana ${inicioSemanaPago.getDate()}/${inicioSemanaPago.getMonth()+1}/${inicioSemanaPago.getFullYear()} - ${fimSemanaPago.getDate()}/${fimSemanaPago.getMonth()+1}/${fimSemanaPago.getFullYear()}`)
    }else if(filtroDatasPagamento === 'mes'){
      return (`Pagamentos para o mês ${dia.getMonth()+1}/${dia.getFullYear()}`)
    }
  }

  //Funcao para desenhar data de forma limpa
  const drawDia = (diaRecebido) => {
    if (!diaRecebido) return "-";
    return (diaRecebido.slice(8,10)+"/"+diaRecebido.slice(5,7)+"/"+diaRecebido.slice(0,4))
  }

  const drawPagamentos = () => {
    return(
      <div>
        {drawTitulo()}
        <div className='overflow-x-auto'>
          {/* Tabela das notas a mostrar */}
          <table className='table table-zebra table-fixed w-full'>
            <thead>
              <tr>
                <th className='w-80'>Descrição</th>
                <th className='w-20'>Valor</th>
                <th className='w-25'>Tipo</th>
                <th className='w-30'>Data Vencimento</th>
                <th className='w-30'>Data Pago</th>
                <th className='w-60'>Utilizador</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {pagaFilter.map(paga => (
                <tr key={paga.id_pagamento}>
                  <td className='truncate'>{paga.pagamento_tipo}</td>
                  <td className='truncate'>{paga.valor}</td>
                  <td className='truncate'>{(paga.is_receita ? ("Receita") : ("Despesa"))}</td>
                  <td className='truncate'>{drawDia(paga.data_vencimento)}</td>
                  <td className='truncate'>{drawDia(paga.data_pago)}</td>
                  <td className='truncate'>{paga.nome}</td>
                  <td>
                    <div className='flex gap-2'>
                      {/* Botao de editar */}
                      <button className='btn btn-warning btn-sm' onClick={() => handleEdit(paga)}>
                        <SquarePen className='size-4' />
                      </button>
                      {/* Botao de eliminar */}
                      <button className='btn btn-error btn-sm' onClick={() => {
                        setExpDel(paga)
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
    )
  }

  const estatisticas = pagaFilter.reduce(
  (total, paga) => {
    const valor = Number(paga.valor) || 0;

    total.totalVencimentos += valor;

    if (paga.data_pago) {
      total.totalPagos += valor;
    } else {
      total.totalPorPagar += valor;
    }

    if (paga.is_receita) {
      total.receitas += valor;
    } else {
      total.despesas += valor;
    }

    return total;
  },
  {
    totalVencimentos: 0,
    totalPagos: 0,
    totalPorPagar: 0,
    receitas: 0,
    despesas: 0,
  })

  //Formatar para euro e limita casas decimais para 2
  const formatEuro = (valor) => Number(valor).toLocaleString("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewPagamento({
      tipo: exp.pagamento_tipo,
      valor: exp.valor,
      is_receita: exp.is_receita,
      data_vencimento: exp.data_vencimento,
      data_pago: exp.data_pago,
      id_utilizador: exp.id_utilizador
    })
    setEditIDpagamento(exp.id_pagamento)
    document.getElementById("editPagamentoModal").showModal()
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className='card-body'>
        {/* Header */}
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <h2 className='text-xl font-semibold'>
            Pagamentos
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addPagamentoModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Pagamento
            </button>
          </div>
        </div>

        

        {/* Estatisticas */}
        <div className="stats shadow w-full mb-4">

          <div className="stat">
            <div className="stat-title">Receitas</div>
            <div className="stat-value text-success">
              {formatEuro(estatisticas.receitas)}€
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Despesas</div>
            <div className="stat-value text-error">
              {formatEuro(estatisticas.despesas)}€
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Em Atraso</div>
            <div className="stat-value text-warning">
              {formatEuro(estatisticas.totalPorPagar)}€
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Balanço Total</div>
            <div className="stat-value text-warning">
              {formatEuro(estatisticas.receitas - estatisticas.despesas)}€
            </div>
          </div>

        </div>

        {/* Filtros de datas e pessoas */}
        <div className='flex justify-end'>
          <h3 className='flex items-center mr-4'>Filtrar por:</h3>
          {/* Botoes de filtrar por itens pagos/por pagar */}
          <button className={`btn mr-4 ${(filtroPagar !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroPagar'>
            Pago/Por Pagar
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroPagar'>
            <li><button className={`btn btn-sm ${(filtroPagar === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPagar('todas');}}>
              Todos
            </button></li>

            <li><button className={`btn btn-sm ${(filtroPagar === 'pagos') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPagar('pagos');}}>
              Ver Pagos
            </button></li>
            <li><button className={`btn btn-sm ${(filtroPagar === 'porPagar') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPagar('porPagar');}}>
              Ver Por Pagar
            </button></li>
          </ul>
          {/* Botoes de filtrar por datas de vencimento*/}
          <button className={`btn mr-4 ${(filtroDatas !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroDatas'>
            Data Vencimento
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroDatas'>
            <li><button className={`btn btn-sm ${(filtroDatas === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroDatas('todas')}>
              Todas
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('semana');
              setChooseFiltro('vencimento');
              document.getElementById("chooseWeekModal").showModal()}}>
              Ver Semana
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('mes');
              setChooseFiltro('vencimento');
              document.getElementById("chooseMonthModal").showModal()}}>
              Ver Mês
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatas === 'ano') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatas('ano');
              setChooseFiltro('vencimento');
              document.getElementById("chooseDayModal").showModal()}}>
              Ver Ano
            </button></li>
          </ul>

          {/* Botoes de filtrar por datas de pagamento */}
          <button className={`btn mr-4 ${(filtroDatasPagamento !== 'todas') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroDatasPagamento'>
            Data Pagamento
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroDatasPagamento'>
            <li><button className={`btn btn-sm ${(filtroDatasPagamento === 'todas') ? ('btn-primary') : ('btn-outline')}`} onClick={() => setFiltroDatasPagamento('todas')}>
              Todas
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatasPagamento === 'semana') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatasPagamento('semana');
              setChooseFiltro('pagamento');
              document.getElementById("chooseWeekModal").showModal()}}>
              Ver Semana
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatasPagamento === 'mes') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatasPagamento('mes');
              setChooseFiltro('pagamento');
              document.getElementById("chooseMonthModal").showModal()}}>
              Ver Mês
            </button></li>

            <li><button className={`btn btn-sm ${(filtroDatasPagamento === 'ano') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {
              setFiltroDatasPagamento('ano');
              setChooseFiltro('pagamento');
              document.getElementById("chooseDayModal").showModal()}}>
              Ver Ano
            </button></li>
          </ul>

          {/* Botoes de filtrar por utilizadores */}
          <button className={`btn mr-4 ${(filtroUser !== '') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroUsers'>
            Utilizador
          </button>
          <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroUsers'>
            <li><button className={`btn btn-sm ${(filtroUser === '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroUser('');}}>
              Todos
            </button></li>

            <li><button className={`btn btn-sm ${(filtroUser !== '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {document.getElementById("choosePessoaModal").showModal()}}>
              Ver Utilizador
            </button></li>
          </ul>

        </div>

        <div className='grid gap-4'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='loading loading-spinner loading-lg' />
            </div>
          ) : (
            <div className='w-full'>
              {drawPagamentos()}
            </div>
          )}

        </div>

      </div>

      {/* Modais */}
      <ChooseWeekModal onSelectDia={(selectDia) => {
        if(chooseFiltro === 'pagamento'){
          setDiaPago(selectDia)
        } else {
          setDia(selectDia)
        }
        setChooseFiltro("")
        }}/>
      <ChooseMonthModal onSelectDia={(selectDia) => {
        if(chooseFiltro === 'pagamento'){
          setDiaPago(selectDia)
        } else {
          setDia(selectDia)
        }
        setChooseFiltro("")
        }}/>
      <ChoosePessoaModal listPessoas={allPessoas} onSelectPessoa={(selectPessoa) => {setFiltroUser(selectPessoa)}}/>
      <AddPagamentoModal />
      <EditPagamentoModal />
      <ConfirmDeleteModal titulo={"este pagamento"} onConfirm={() => deletePagamento(expDel?.id_pagamento)} />
    </div>
  )
}

export default GestorPagamentos
