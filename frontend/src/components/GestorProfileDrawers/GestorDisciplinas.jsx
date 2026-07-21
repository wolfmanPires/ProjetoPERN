import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import EditDisciplinaModal from '../Modals/GestorDisciplinas/EditDisciplinaModal'
import AddDisciplinaModal from '../Modals/GestorDisciplinas/AddDisciplinaModal'
import { gestorAuth } from '../../constants/gestorAuth'

function GestorDisciplinas() {
  const {loading, disciplinas, setNewDisciplina, setEditIDdisciplina, deleteDisciplina, getAllDisciplinas} = gestorAuth()
  const [pesquisa, setPesquisa] = useState("")
  const [pesquisaAno, setPesquisaAno] = useState("")
  const [pesquisaArea, setPesquisaArea] = useState("")
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllDisciplinas()
  },[])

  //Funcao de filtrar disciplinas
  const disciplinasFiltrados = disciplinas.filter((exp) => {
    const nomeFiltro = exp.nome.toLowerCase().includes(pesquisa.toLowerCase())
    const anoFiltro = pesquisaAno === "" || Number(pesquisaAno) === Number(exp.ano)
    const areaFiltro = exp.area_cientifica.toLowerCase().includes(pesquisaArea.toLowerCase())

    return nomeFiltro && anoFiltro && areaFiltro
  })

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewDisciplina({
      nome: exp.nome,
      ano: exp.ano,
      area_cientifica: exp.area_cientifica
    })
    setEditIDdisciplina(exp.id_disciplina)
    document.getElementById("editDisciplinaModal").showModal()
  }

  //Funcao para limpar pesquisas
  const limparPesquisas = () => {
    setPesquisa("")
    setPesquisaAno("")
    setPesquisaArea("")
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className='card-body'>
        {/* Area de titulo / botao de adicao */}
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <h2 className='text-xl font-semibold'>
            Disciplinas
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addDisciplinaModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Disciplina
            </button>
          </div>
        </div>

        {/* Area de pesquisa/filtros/ordem de amostragem */}
        <div className='flex flex-wrap gap-4 mb-2'>
          <label className="input input-bordered flex items-center gap-2 w-80">
            <Search className="size-4"/>
            <input type="text" className="grow" placeholder="Pesquisar nome..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-22">
            <Search className="size-4"/>
            <input type="number" min="0" max="12" className="grow" placeholder="Ano..." value={pesquisaAno} onChange={(e) => setPesquisaAno(e.target.value)} />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-80">
            <Search className="size-4"/>
            <input type="text" className="grow" placeholder="Pesquisar área científica..." value={pesquisaArea} onChange={(e) => setPesquisaArea(e.target.value)} />
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
            {/* Tabela dos explicadores a mostrar */}
            <table className='table table-zebra table-fixed w-full'>
              <thead>
                <tr>
                  <th className='w-80'>Nome</th>
                  <th className='w-20'>Ano</th>
                  <th className='w-80'>Área Científica</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {disciplinasFiltrados.map(exp => (
                  <tr key={exp.id_disciplina}>
                    <td className='truncate'>{exp.nome}</td>
                    <td className='truncate'>{exp.ano}</td>
                    <td className='truncate'>{exp.area_cientifica}</td>
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
      <AddDisciplinaModal />
      <EditDisciplinaModal />
      <ConfirmDeleteModal titulo={expDel?.nome} onConfirm={() => deleteDisciplina(expDel?.id_disciplina)} />
    </div>
  )
}

export default GestorDisciplinas
