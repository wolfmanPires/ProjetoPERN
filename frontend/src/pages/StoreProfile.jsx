import React, { useState } from 'react'
import { doLogin } from '../constants/loginRegister';
import { useAuthStore } from '../constants/useAuthStore';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import StoreUserData from '../components/StoreProfileTabs/StoreUserData';
import StoreUserEncomendas from '../components/StoreProfileTabs/StoreUserEncomendas';
import { CircleUserRound, NotebookPen } from 'lucide-react';

function StoreProfile() {
  const [activeTab, setActiveTab] = useState('utilizador');
  const {userStore, clearStoreSession} = useAuthStore() 
  const {logout} = doLogin()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    clearStoreSession()
    navigate("/store", {replace: true})
  } 

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <BackButton />

      <div className='grid grid-cols-2 w-full mb-4'>
        <h1 className='text-xl font-bold'>
          Perfil de Utilizador - {userStore.nome}
        </h1>

        {/* Botao de logout */}
        <div className='flex justify-end'>
          <button className='btn btn-error' onClick={handleLogout}>Terminar Sessão</button>
        </div>
      </div>
      
      {/* Abas de seleção da página */}
      <div className='tabs tabs-box mb-4'>
        {/* Utilizador */}
        <button className={`tab ${activeTab==='utilizador' ? 'tab-active' : ''}`} onClick={() => setActiveTab('utilizador')}>
          <CircleUserRound className='size-4 mr-2' /> Dados Utilizador
        </button>

        {/* Encomendas */}
        <button className={`tab ${activeTab==='encomendas' ? 'tab-active' : ''}`} onClick={() => setActiveTab('encomendas')}>
          <NotebookPen className='size-4 mr-2' /> Encomendas
        </button>
      </div>

      {/* Conteudos de cada aba da pagina */}
      { activeTab === 'utilizador' && <StoreUserData/> }
      { activeTab === 'encomendas' && <StoreUserEncomendas/> }

    </main>
  )
}

export default StoreProfile
