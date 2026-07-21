import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doLogin } from '../constants/loginRegister'
import { useAuth } from '../constants/useAuth'
import GestorGeral from '../components/GestorProfileDrawers/GestorGeral'
import GestorExplicacoes from '../components/GestorProfileDrawers/GestorExplicacoes'
import GestorExplicadores from '../components/GestorProfileDrawers/GestorExplicadores'
import GestorExplicandos from '../components/GestorProfileDrawers/GestorExplicandos'
import GestorPagamentos from '../components/GestorProfileDrawers/GestorPagamentos'
import GestorNotas from '../components/GestorProfileDrawers/GestorNotas'
import GestorDisciplinas from '../components/GestorProfileDrawers/GestorDisciplinas'
import GestorAvalFuturas from '../components/GestorProfileDrawers/GestorAvalFuturas'
import GestorGestores from '../components/GestorProfileDrawers/GestorGestores'

function GestorProfile() {
  const [currDrawer, setCurrDrawer] = useState("geral")
  const [filtroExplicandoNotas, setFiltroExplicandoNotas] = useState("")
  const [filtroExplicandoAvalFuturas, setFiltroExplicandoAvalFuturas] = useState("")
  const agora = new Date()
  const navigate = useNavigate()
  const {logout} = doLogin()
  const {user} = useAuth()

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
            {/* Conteudos de cada drawer da sidebar */}
            {currDrawer === 'geral' && <GestorGeral mudarDrawer={setCurrDrawer}/>}
            {currDrawer === 'gestores' && <GestorGestores />}
            {currDrawer === 'explicadores' && <GestorExplicadores />}
            {currDrawer === 'explicandos' && <GestorExplicandos verNotas={(nome) => {
              setFiltroExplicandoNotas(nome)
              setCurrDrawer("notas")
            }} verAvalFuturas={(nome) => {
              setFiltroExplicandoAvalFuturas(nome)
              setCurrDrawer("avalFuturas")
            }} />}
            {currDrawer === 'explicacoes' && <GestorExplicacoes />}
            {currDrawer === 'pagamentos' && <GestorPagamentos />}
            {currDrawer === 'notas' && <GestorNotas filtroExplicando={filtroExplicandoNotas}/>}
            {currDrawer === 'disciplinas' && <GestorDisciplinas />}
            {currDrawer === 'avalFuturas' && <GestorAvalFuturas filtroExplicando={filtroExplicandoAvalFuturas}/>}
          </div>
          
          {/* Parar de inserir conteudos ate aqui */}
        </div>

        <div className='drawer-side' style={{top: "var(--navbar-height)", height: "calc(100vh - var(--navbar-height))"}}>
          <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
          <ul className='menu bg-accent h-full w-50 p-4 overflow-y-auto'>
            {/* Tabs do sidebar sao inseridas aqui */}
            <li><a className={`text-xl ${currDrawer === 'geral' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('geral')}>Geral</a></li>
            <li><a className={`text-xl ${currDrawer === 'gestores' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('gestores')}>Gestores</a></li>
            <li><a className={`text-xl ${currDrawer === 'explicadores' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('explicadores')}>Explicadores</a></li>
            <li><a className={`text-xl ${currDrawer === 'explicandos' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('explicandos')}>Explicandos</a></li>
            <li><a className={`text-xl ${currDrawer === 'explicacoes' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('explicacoes')}>Explicações</a></li>
            <li><a className={`text-xl ${currDrawer === 'pagamentos' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('pagamentos')}>Pagamentos</a></li>
            <li><a className={`text-xl ${currDrawer === 'notas' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('notas')}>Notas</a></li>
            <li><a className={`text-xl ${currDrawer === 'disciplinas' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('disciplinas')}>Disciplinas</a></li>
            <li><a className={`text-xl ${currDrawer === 'avalFuturas' ? 'bg-base-100' : 'text-base-100'}`}
              onClick={() => setCurrDrawer('avalFuturas')}>Avaliações Futuras</a></li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default GestorProfile
