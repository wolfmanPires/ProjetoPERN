import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { gestorAuth } from '../../constants/gestorAuth'
import AddNotaModal from '../Modals/GestorNotas/AddNotaModal'
import EditNotaModal from '../Modals/GestorNotas/EditNotaModal'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'

function GestorNotas({filtroExplicando}) {
  const {loading, notas, setNewNota, setEditIDnota, deleteNota, getAllNotas, getAllDisciplinas, getAllExplicandos} = gestorAuth()
  const [pesquisa, setPesquisa] = useState("")
  const [pesquisaExp, setPesquisaExp] = useState("")
  const [pesquisaDisc, setPesquisaDisc] = useState("")
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllExplicandos()
    getAllDisciplinas()
    getAllNotas()
    if(filtroExplicando){
      setPesquisaExp(filtroExplicando)
    }
  },[filtroExplicando])

  //Funcao de filtrar notas
  const notasFiltrados = notas.filter((exp) => {
    const descricaoFilter = exp.descricao.toLowerCase().includes(pesquisa.toLowerCase())
    const explicandoFilter = exp.explicando_nome.toLowerCase().includes(pesquisaExp.toLowerCase())
    const disciplinaFilter = exp.disciplina_nome.toLowerCase().includes(pesquisaDisc.toLowerCase())

    return descricaoFilter && explicandoFilter && disciplinaFilter
  })

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewNota({
      data_avaliacao: exp.data_avaliacao,
      descricao: exp.descricao,
      valor: exp.valor,
      id_disciplina: exp.id_disciplina,
      id_explicando: exp.id_explicando
    })
    setEditIDnota(exp.id_notas)
    document.getElementById("editNotaModal").showModal()
  }

  //Funcao para desenhar data de forma limpa
  const drawDia = (exp) => {
    return (exp.data_avaliacao.slice(8,10)+"/"+exp.data_avaliacao.slice(5,7)+"/"+exp.data_avaliacao.slice(0,4))
  }

  //Funcao para limpar pesquisas
  const limparPesquisas = () => {
    setPesquisa("")
    setPesquisaDisc("")
    setPesquisaExp("")
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className='card-body'>
        {/* Area de titulo / botao de adicao */}
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <h2 className='text-xl font-semibold'>
            Notas e Classificações
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addNotaModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Nota
            </button>
          </div>
        </div>

        {/* Area de pesquisa/filtros/ordem de amostragem */}
        <div className='flex flex-wrap gap-4 mb-2'>
          <label className="input input-bordered flex items-center gap-2">
            <Search className="size-4"/>
            <input type="text" className="grow" 
              placeholder="Pesquisar descrição..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
          </label>

          <label className={`input flex items-center gap-2 ${pesquisaDisc  ? 'input-warning border-warning' : 'input-bordered'}`}>
            <Search className="size-4"/>
            <input type="text" className="grow" 
              placeholder="Pesquisar Disciplina..." value={pesquisaDisc} onChange={(e) => setPesquisaDisc(e.target.value)} />
          </label>

          <label className={`input flex items-center gap-2 ${pesquisaExp  ? 'input-error border-error' : 'input-bordered'}`}>
            <Search className="size-4"/>
            <input type="text" className="grow" 
              placeholder="Pesquisar Explicando..." value={pesquisaExp} onChange={(e) => setPesquisaExp(e.target.value)} />
          </label>

          <button className='btn btn-primary' onClick={limparPesquisas}>
            Limpar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            {/* Tabela das notas a mostrar */}
            <table className='table table-zebra table-fixed w-full'>
              <thead>
                <tr>
                  <th className='w-30'>Data Avaliação</th>
                  <th className='w-80'>Descrição</th>
                  <th className='w-20'>Valor</th>
                  <th className='w-60'>Disciplina</th>
                  <th className='w-60'>Explicando</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {notasFiltrados.map(exp => (
                  <tr key={exp.id_notas}>
                    <td className='truncate'>{drawDia(exp)}</td>
                    <td className='truncate'>{exp.descricao}</td>
                    <td className='truncate'>{exp.valor}</td>
                    <td className='truncate'>{exp.disciplina_nome}</td>
                    <td className='truncate'>{exp.explicando_nome}</td>
                    <td>
                      <div className='flex gap-2'>
                        {/* Botao de editar */}
                        <button className='btn btn-warning btn-sm' onClick={() => handleEdit(exp)}>
                          <SquarePen className='size-4' />
                        </button>
                        {/* Botao de eliminar */}
                        <button className='btn btn-error btn-sm' onClick={() => {
                          setExpDel(exp)
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
        )}

      </div>

      {/* Area de Modais */}
      <AddNotaModal id_avalFutura={-1}/>
      <EditNotaModal />
      <ConfirmDeleteModal titulo={"esta nota"} onConfirm={() => deleteNota(expDel?.id_notas)} />
    </div>
  )
}

export default GestorNotas
