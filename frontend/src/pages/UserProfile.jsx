import { BadgeEuro, CircleUserRound, NotebookPen } from 'lucide-react';
import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import UserData from '../components/UserProfileTabs/UserData';
import UserPayments from '../components/UserProfileTabs/UserPayments';
import UserExplicacoes from '../components/UserProfileTabs/UserExplicacoes';
import { doLogin } from '../constants/loginRegister';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../constants/useAuth';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('utilizador');
  const {user} = useAuth() 
  const {logout} = doLogin()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/userLogin")
  } 

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <BackButton />

      <div className='grid grid-cols-2 w-full mb-4'>
        <h1 className='text-xl font-bold'>
          Perfil de Utilizador - {user.nome}
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
          <CircleUserRound className='size-4 mr-2' /> Utilizador
        </button>

        {/* Pagamentos */}
        <button className={`tab ${activeTab==='pagamentos' ? 'tab-active' : ''}`} onClick={() => setActiveTab('pagamentos')}>
          <BadgeEuro className='size-4 mr-2' /> Pagamentos
        </button>

        {/* Explicacoes */}
        <button className={`tab ${activeTab==='explicacoes' ? 'tab-active' : ''}`} onClick={() => setActiveTab('explicacoes')}>
          <NotebookPen className='size-4 mr-2' /> Explicações
        </button>
      </div>

      {/* Conteudos de cada aba da pagina */}
      { activeTab === 'utilizador' && <UserData/> }
      { activeTab === 'pagamentos' && <UserPayments/> }
      { activeTab === 'explicacoes' && <UserExplicacoes/> }

    </main>
  )
}

export default UserProfile
