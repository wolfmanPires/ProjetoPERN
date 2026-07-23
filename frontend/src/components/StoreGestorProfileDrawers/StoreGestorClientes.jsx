import React, { useEffect, useState } from 'react'
import { gestorAuthStore } from '../../constants/gestorAuthStore'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import AddClienteModal from '../Modals/StoreGestorClientes/AddClienteModal'
import EditClienteModal from '../Modals/StoreGestorClientes/EditClienteModal'
import { PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'

function StoreGestorClientes() {
  const {loading, clientes, setNewCliente, setEditIDcliente, deleteCliente, getAllClientes } = gestorAuthStore()
  const [pesquisa, setPesquisa] = useState("")
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllClientes()
  },[])

  //Funcao de filtrar clientes
  const clientesFiltrados = clientes.filter(exp => exp.nome.toLowerCase().includes(pesquisa.toLowerCase()))

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewCliente({
      nome: exp.nome,
      email: exp.email,
      telemovel: exp.telemovel,
      password: ""
    })
    setEditIDcliente(exp.id_utilizador_compras)
    document.getElementById("editClienteModal").showModal()
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
            Clientes
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addClienteModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Cliente
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
                  <th>Verificada</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map(exp => (
                  <tr key={exp.id_utilizador_compras}>
                    <td className='max-w-40 truncate'>{exp.nome}</td>
                    <td className='max-w-48 truncate'>{exp.email}</td>
                    <td className='max-w-28 truncate'>{exp.telemovel}</td>
                    <td className='max-w-28 truncate'>
                      {exp.is_gestor ? (
                        <span className="badge badge-primary">Gestor</span>
                      ) : (
                        <span className="badge badge-accent">Cliente</span>
                      )}
                    </td>
                    <td className='max-w-28 truncate'>
                      {exp.email_verificado ? (
                        <span className="badge badge-success">Verificado</span>
                      ) : (
                        <span className="badge badge-warning">Pendente</span>
                      )}
                    </td>
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
      <AddClienteModal />
      <EditClienteModal />
      <ConfirmDeleteModal titulo={expDel?.nome} onConfirm={() => deleteCliente(expDel?.id_utilizador_compras)} />
    </div>
  )
}

export default StoreGestorClientes
