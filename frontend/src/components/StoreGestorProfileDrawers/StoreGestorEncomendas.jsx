import { Eye, PlusCircleIcon, Search, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal'
import { gestorAuthStore } from '../../constants/gestorAuthStore'
import EncomendaProductsModal from '../Modals/EncomendaProductsModal'
import { useAuthStore } from '../../constants/useAuthStore'

function StoreGestorEncomendas() {
  const {loading, encomendas, setNewEncomenda, setEditIDencomenda, deleteEncomenda, getAllEncomendas } = gestorAuthStore()
  const {getEncomendaByID, getProdutosEncomenda} = useAuthStore()
  const [expDel, setExpDel] = useState(null)
  useEffect(() => {
    getAllEncomendas()
  },[])

  //Funcao para resolver o editar
  const handleEdit = (exp) => {
    setNewCliente({
      estado: exp.estado,
      total: exp.total,
      data_encomenda: exp.data_encomenda,
      estado_pagamento: exp.estado_pagamento,
      data_pagamento: exp.data_pagamento,
      observacoes: exp.observacoes,
      id_utilizador_compras: exp.id_utilizador_compras
    })
    setEditIDencomenda(exp.id_encomenda)
    document.getElementById("editEncomendaModal").showModal()
  }

  //Funcao para limpar pesquisas
  const limparPesquisas = () => {
    setPesquisa("")
  }

  //Interacao do botao de ver encomenda
  const handleView = async (enc) => {
    await getEncomendaByID(enc.id_encomenda)
    await getProdutosEncomenda()
    document.getElementById("encomendaProductsModal").showModal()
  }

  return (
    <div className='card bg-base-100 shadow-lg mt-4'>
      <div className='card-body'>
        {/* Area de titulo / botao de adicao */}
        <div className='grid grid-cols-2 gap-4 mb-2'>
          <h2 className='text-xl font-semibold'>
            Encomendas
          </h2>

          {/*  Implementar depois dos pagamentos
          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => document.getElementById("addClienteModal").showModal()}>
              <PlusCircleIcon className='size-5 mr-2' />
              Adicionar Encomenda
            </button>
          </div>
          */}
        </div>

        {/* Area de pesquisa/filtros/ordem de amostragem */}

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
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Data Enc.</th>
                  <th>Estado Pag.</th>
                  <th>Data Pag.</th>
                  <th>Obser.</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {encomendas.map(exp => (
                  <tr key={exp.encomenda}>
                    <td className='max-w-40 truncate'>{exp.nome_cliente}</td>
                    <td className='max-w-40 truncate'>{exp.estado}</td>
                    <td className='max-w-48 truncate'>{exp.total}€</td>
                    <td className='max-w-28 truncate'>{exp.data_encomenda}</td>
                    <td className='max-w-28 truncate'>{exp.estado_pagamento}</td>
                    <td className='max-w-28 truncate'>{exp.data_pagamento}</td>
                    <td className='max-w-28 truncate'>{exp.observacoes}</td>
                    <td>
                      <div className='flex gap-2'>
                        {/* Botao de ver */}
                        <button className='btn btn-accent btn-sm' onClick={() => handleView(exp)}>
                          <Eye className='size-4' />
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

      {/* Area de Modais 
      <AddClienteModal />
      <EditClienteModal />*/}
      <EncomendaProductsModal />
      <ConfirmDeleteModal titulo={expDel?.nome} onConfirm={() => deleteEncomenda(expDel?.id_encomenda)} />
    </div>
  )
}

export default StoreGestorEncomendas