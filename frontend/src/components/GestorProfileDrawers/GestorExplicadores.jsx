import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddExplicadorModal from '../Modals/GestorEsplicadores/AddExplicadorModal'
import { gestorAuth } from '../../constants/gestorAuth'
import EditExplicadorModal from '../Modals/GestorEsplicadores/EditExplicadorModal'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'

function GestorExplicadores() {
  const {loading, explicadores, getAllExplicadores, setNewUtilizador, setNewExplicador, setEditIDutilizador, setEditIDexplicador, deleteExplicador} = gestorAuth()
  const [pesquisa, setPesquisa] = useState("")
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllExplicadores()
  },[])

  //Funcao de filtrar explicadores
  const explicadoresFiltrados = explicadores.filter(exp => exp.nome.toLowerCase().includes(pesquisa.toLowerCase()))

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewUtilizador({
      nome: exp.nome,
      email: exp.email,
      telemovel: exp.telemovel,
      tipo: "",
      password: ""
    })
    setNewExplicador({
      especialidades: exp.especialidades,
      habilitacoes: exp.habilitacoes,
      valor_hora: exp.valor_hora,
      id_utilizador: exp.id_utilizador
    })
    setEditIDutilizador(exp.id_utilizador)
    setEditIDexplicador(exp.id_explicador)
    document.getElementById("editExplicadorModal").showModal()
  }

  //Funcao para limpar pesquisas
  const limparPesquisas = () => {
    setPesquisa("")
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className='card-body'>
        {/* Area de titulo / botao de adicao */}
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <h2 className='text-xl font-semibold'>
            Explicadores
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addExplicadorModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Explicador
            </button>
          </div>
        </div>

        {/* Area de pesquisa/filtros/ordem de amostragem */}
        <div className='flex flex-wrap gap-4 mb-2'>
          <label className="input input-bordered flex items-center gap-2">
            <Search className="size-4"/>
            <input type="text" className="grow" placeholder="Pesquisar..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
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
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telemóvel</th>
                  <th>Especialidades</th>
                  <th>Habilitações</th>
                  <th>Valor/Hora</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {explicadoresFiltrados.map(exp => (
                  <tr key={exp.id_utilizador}>
                    <td className='max-w-40 truncate'>{exp.nome}</td>
                    <td className='max-w-48 truncate'>{exp.email}</td>
                    <td className='max-w-28 truncate'>{exp.telemovel}</td>
                    <td className='max-w-80 truncate'>{exp.especialidades}</td>
                    <td className='max-w-80 truncate'>{exp.habilitacoes}</td>
                    <td className='max-w-20 truncate'>{exp.valor_hora}</td>
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
      <AddExplicadorModal />
      <EditExplicadorModal />
      <ConfirmDeleteModal titulo={expDel?.nome} onConfirm={() => deleteExplicador(expDel?.id_utilizador)} />
    </div>
  )
}

export default GestorExplicadores