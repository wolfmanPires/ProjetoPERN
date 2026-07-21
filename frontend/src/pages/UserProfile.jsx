import { BadgeEuro, ChevronLeft, CircleCheckBig, CircleUserRound, ClipboardPen, NotebookPen } from 'lucide-react';
import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import UserData from '../components/UserProfileTabs/UserData';
import UserPayments from '../components/UserProfileTabs/UserPayments';
import UserExplicacoes from '../components/UserProfileTabs/UserExplicacoes';
import { doLogin } from '../constants/loginRegister';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../constants/useAuth';
import UserAvalFuturas from '../components/UserProfileTabs/UserAvalFuturas';
import UserNotas from '../components/UserProfileTabs/UserNotas';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('utilizador');
  const {user} = useAuth() 
  const {logout} = doLogin()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/userLogin")
  } 

  const handleGoBack = () => {
    {/* Verifica se a pagina anterior e do site ou nao */}
    const isInternalReferrer = document.referrer && document.referrer.startsWith(window.location.origin)

    {/* Caso sim, volta para ela, caso nao, vai para a pagina principal de explicacoes*/}
    if (isInternalReferrer){
        navigate(-1)
    }else{
        navigate("/userHomePage")
    }
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <button className='btn btn-ghost rounded-full' onClick={handleGoBack}>
          <ChevronLeft className='size-8'/>
          <div className='text-lg'>Voltar</div>
        </button>
      </div>

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

        {/* Explicacoes */}
        <button className={`tab ${activeTab==='avalFuturas' ? 'tab-active' : ''}`} onClick={() => setActiveTab('avalFuturas')}>
          <ClipboardPen className='size-4 mr-2' /> Avaliações Futuras
        </button>

        {/* Explicacoes */}
        <button className={`tab ${activeTab==='notas' ? 'tab-active' : ''}`} onClick={() => setActiveTab('notas')}>
          <CircleCheckBig className='size-4 mr-2' /> Notas
        </button>
      </div>
      
      {/* Conteudos de cada aba da pagina */}
      { activeTab === 'utilizador' && <UserData/> }
      { activeTab === 'pagamentos' && <UserPayments/> }
      { activeTab === 'explicacoes' && <UserExplicacoes/> }
      { activeTab === 'avalFuturas' && <UserAvalFuturas/> }
      { activeTab === 'notas' && <UserNotas/> }

    </main>
  )
}

export default UserProfile
