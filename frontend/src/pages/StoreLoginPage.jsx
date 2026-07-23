import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoLoja from '../assets/int-loja-BGless.png'
import { Eye, EyeClosed, KeyRound, Mail } from 'lucide-react';
import BackButton from '../components/BackButton';
import { doLogin } from '../constants/loginRegister';
import { useAuthStore } from "../constants/useAuthStore";

function StoreLoginPage() {
  const [isVisible, setIsVisible] = useState()
  useEffect(() => {
    setIsVisible(false)
  },[])
  //Funcoes de login
  const {storeUser, storeFormData, setStoreFormData, verificaPassStore, loading} = doLogin();
  const { checkUserStore, checkGestor} = useAuthStore();
  //Trata da navegacao das paginas caso haja sucesso no login
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    const success = await verificaPassStore(e);
    if (success){
        {/* Verifica se a pagina anterior e do site ou nao */}
        const isInternalReferrer = document.referrer && document.referrer.startsWith(window.location.origin)

        await checkUserStore();
        const isGestor = checkGestor()

        {/* Caso sim, volta para ela, caso nao, vai para a pagina principal da loja */}
        if (isInternalReferrer){
          navigate(-1)
        }else{
          if(isGestor != []){
            navigate("/store/storeGestor")
          }else{
            navigate("/store")
          }
        }
    }
  }

  //Muda o botao de visibilidade
  const handleVisibility = () => {
    if(isVisible){
      setIsVisible(false)
    }else{
      setIsVisible(true)
    }
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <BackButton />

      {/* Regiao dos logos */}
      <div className='flex justify-center gap-4 mb-6'>
        <img src={logoLoja} alt='Logotipo ASAS' className='w-2/5'/>
      </div>

      {/* Regiao das inputs dos dados do utilizador das explicacoes */}
      <form onSubmit={handleLogin} className='space-y-6'>
            <div className='grid gap-3 items-center w-1/2 mx-auto'>
                {/* Entrada do E-mail */}
                <div className='form-control'>
                    <div className='relative'>
                        <input type='email' placeholder='E-mail de Utilizador'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={storeFormData.email} onChange={(e) => {setStoreFormData({...storeFormData, email:e.target.value})}}/>
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <Mail className='size-5' />
                        </div>
                    </div>
                </div>

                {/* Entrada da password*/}
                <div className='form-control'>
                    <div className='relative'>
                        <input type={isVisible ? 'text' : 'password'} placeholder='Palavra-Passe'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={storeFormData.password} onChange={(e) => {setStoreFormData({...storeFormData, password:e.target.value})}}/> 
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                          <KeyRound className='size-5' />
                        </div>
                        <button type='button' className='absolute inset-y-0 right-3 flex items-center text-base-content/50' onClick={handleVisibility}>
                          {isVisible && <Eye className='size-5' />}
                          {!isVisible && <EyeClosed className='size-5' />}
                        </button>
                    </div>
                </div>

                {/* Botao de confirmacao */}
                <button className='btn btn-primary btn-outline'
                 type='submit' disabled={loading}>
                  {loading ? "A carregar..." : "Iniciar sessão"}
                </button>
            </div>

          {/* Ir para area de registo */}
          <div className='flex justify-center gap-4 pt-4 mb-6'>
            <Link to="/storeRegister" className="btn btn-ghost">
              Ainda não tens conta? Registar
            </Link>
          </div>

          {/* Ir para a area de recuperacao de palavra-passe */}
          <div className="flex justify-center">
            <Link to="/store/pedir-recuperacao-password" className="link link-primary text-sm" >
              Esqueceste-te da palavra-passe?
            </Link>
          </div>

        </form>
    </main>
  )
}

export default StoreLoginPage
