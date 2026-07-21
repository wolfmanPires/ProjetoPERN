import React, { useEffect, useState } from 'react'
import AddExplicandoModal from '../Modals/GestorExplicandos/AddExplicandoModal'
import EditExplicandoModal from '../Modals/GestorExplicandos/EditExplicandoModal'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import { gestorAuth } from '../../constants/gestorAuth'
import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'

function GestorExplicandos({verNotas, verAvalFuturas}) {
  const {loading, explicandos, getAllExplicandos, setNewUtilizador, setNewExplicando, setEditIDutilizador, setEditIDexplicando, deleteExplicando} = gestorAuth()
  const [pesquisa, setPesquisa] = useState("")
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllExplicandos()
  },[])

  //Funcao de filtrar explicandos
  const explicandosFiltrados = explicandos.filter(exp => exp.nome.toLowerCase().includes(pesquisa.toLowerCase()))

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewUtilizador({
      nome: exp.nome,
      email: exp.email,
      telemovel: exp.telemovel,
      tipo: "",
      password: ""
    })
    setNewExplicando({
      dificuldades: exp.dificuldades,
      ano: exp.ano,
      valor_mensalidade: exp.valor_mensalidade,
      id_utilizador: exp.id_utilizador
    })
    setEditIDutilizador(exp.id_utilizador)
    setEditIDexplicando(exp.id_explicando)
    document.getElementById("editExplicandoModal").showModal()
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
            Explicandos
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addExplicandoModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Explicando
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
                  <th className='w-50'>Nome</th>
                  <th className='w-50'>E-mail</th>
                  <th className='w-30'>Telemóvel</th>
                  <th className='w-50'>Dificuldades</th>
                  <th className='w-15'>Ano</th>
                  <th className='w-25'>Mensalidade</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {explicandosFiltrados.map(exp => (
                  <tr key={exp.id_utilizador}>
                    <td className='truncate'>{exp.nome}</td>
                    <td className='truncate'>{exp.email}</td>
                    <td className='truncate'>{exp.telemovel}</td>
                    <td className='truncate'>{exp.dificuldades}</td>
                    <td className='truncate'>{exp.ano}</td>
                    <td className='truncate'>{exp.valor_mensalidade} €</td>
                    <td>
                      <div className='flex gap-2'>
                        {/* Botao de ver as notas dele */}
                        <button className='btn btn-sm btn-primary' onClick={() => verNotas(exp.nome)}>
                          Ver notas
                        </button>
                        {/* Botao de ver as avaliacoes futuras dele */}
                        <button className='btn btn-sm btn-primary' onClick={() => verAvalFuturas(exp.nome)}>
                          Aval. futuras
                        </button>
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
      <AddExplicandoModal />
      <EditExplicandoModal />
      <ConfirmDeleteModal titulo={expDel?.nome} onConfirm={() => deleteExplicando(expDel?.id_utilizador)} />
    </div>
  )
}

export default GestorExplicandos
