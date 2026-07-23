import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreGestorClientes from '../components/StoreGestorProfileDrawers/StoreGestorClientes'
import StoreGestorGeral from '../components/StoreGestorProfileDrawers/StoreGestorGeral'
import StoreGestorGestores from '../components/StoreGestorProfileDrawers/StoreGestorGestores'
import StoreGestorProdutos from '../components/StoreGestorProfileDrawers/StoreGestorProdutos'
import StoreGestorEncomendas from '../components/StoreGestorProfileDrawers/StoreGestorEncomendas'

function StoreGestorProfile() {
  const [currDrawer, setCurrDrawer] = useState("geral")
  const [filtroExplicandoNotas, setFiltroExplicandoNotas] = useState("")
  const [filtroExplicandoAvalFuturas, setFiltroExplicandoAvalFuturas] = useState("")
  const agora = new Date()
  const navigate = useNavigate()

  return (
    <main className='mx-auto w-full'>
      {/* Sidebar com componentes para os gestores navegar */}
      <div className='drawer lg:drawer-open overflow-hidden'
        style={{height: "calc(100vh - var(--navbar-height))"}}>
        <input id='my-drawer' type='checkbox' className='drawer-toggle'/>
        <div className='drawer-content flex flex-col h-full overflow-hidden'>
          {/* Botao de abrir sidebar para ecras pequenos (telemoveis) */}
          <label htmlFor='my-drawer' className='btn drawer-button btn-primary lg:hidden'>
            Abrir menu
          </label>

          {/* Inserir conteudos a desenhar na pagina a partir deste ponto */}
          
          <div className='flex-1 overflow-y-auto px-8 pb-8'>
            {currDrawer === 'clientes' && <StoreGestorClientes />}
            {currDrawer === 'geral' && <StoreGestorGeral />}
            {currDrawer === 'produtos' && <StoreGestorProdutos />}
            {currDrawer === 'encomendas' && <StoreGestorEncomendas />}
          </div>
          
          {/* Parar de inserir conteudos ate aqui */}
        </div>

        <div className='drawer-side' style={{top: "var(--navbar-height)", height: "calc(100vh - var(--navbar-height))"}}>
          <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
          <ul className='menu bg-accent h-full w-50 p-4 overflow-y-auto'>
            {/* Tabs do sidebar sao inseridas aqui */}
            <li><a className={`text-xl ${currDrawer === 'geral' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('geral')}>Geral</a></li>
            <li><a className={`text-xl ${currDrawer === 'clientes' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('clientes')}>Clientes</a></li>
            <li><a className={`text-xl ${currDrawer === 'produtos' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('produtos')}>Produtos</a></li>
            <li><a className={`text-xl ${currDrawer === 'encomendas' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('encomendas')}>Encomendas</a></li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default StoreGestorProfile
