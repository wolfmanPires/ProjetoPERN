import { Search, SquarePen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { gestorAuthStore } from '../../constants/gestorAuthStore'
import { useNavigate } from 'react-router-dom'

function StoreGestorProdutos() {
  const {loading, produtos, getAllProdutos } = gestorAuthStore()
  const [pesquisa, setPesquisa] = useState("")
  const [expDel, setExpDel] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    getAllProdutos()
  },[])

  //Funcao de filtrar products
  const productsFiltrados = produtos.filter(exp => exp.name.toLowerCase().includes(pesquisa.toLowerCase()))

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
            Produtos
          </h2>

          <div className='flex justify-end'>
            <button className='btn btn-primary rounded-full' onClick={() => navigate("/store/storeGestor")}>
              <SquarePen className='size-5 mr-2' />
              Gerir Produtos
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
                  <th>Descrição</th>
                  <th>Imagem</th>
                  <th>Preço</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {productsFiltrados.map(exp => (
                  <tr key={exp.id_products}>
                    <td className='max-w-40 truncate'>{exp.name}</td>
                    <td className='max-w-48 truncate'>{exp.description}</td>
                    <td className='max-w-28 truncate'>{exp.image}</td>
                    <td className='max-w-28 truncate'>{exp.price}€</td>
                    <td className='max-w-28 truncate'>{exp.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default StoreGestorProdutos
