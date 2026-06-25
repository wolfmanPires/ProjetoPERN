import React from 'react'
import logoASAS from '../assets/ASASBGBranco.jpg'
import logoMissao from '../assets/MissaoSaberBGAzul.png'
import { ChevronLeft, KeyRound, Mail } from 'lucide-react';
import BackButton from '../components/BackButton';
import { doLogin } from '../constants/loginRegister';
import { useNavigate } from 'react-router-dom';

function ExplicLoginPage() {
  //Funcoes de login
  const {user, formData, setFormData, verificaPass, loading} = doLogin();
  //Trata da navegacao das paginas caso haja sucesso no login
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    const success = await verificaPass(e);
    if (success){
        {/* Verifica se a pagina anterior e do site ou nao */}
        const isInternalReferrer = document.referrer && document.referrer.startsWith(window.location.origin)

        {/* Caso sim, volta para ela, caso nao, vai para a pagina principal do site (sim e um dark pattern) */}
        if (isInternalReferrer){
            navigate(-1)
        }else{
            if(success.tipo === 'gestor'){
                {/* Caso seja um gestor a dar login, vai para a pagina dos gestores */}
                navigate("/gestorProfile")
            }else{
                {/* Caso seja outro tipo de user, vai para a pagina de dashboard de explicacoes */}
                navigate("/")
            }
        }
    }
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      <BackButton />

      {/* Regiao dos logos */}
      <div className='flex justify-between items-center gap-4 pt-6 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
          <img src={logoASAS} alt='Logotipo ASAS' />
          <img src={logoMissao} alt='Logotipo Missão Saber' />
        </div>
      </div>

      {/* Regiao das inputs dos dados do utilizador das explicacoes */}
      <form onSubmit={handleLogin} className='space-y-6'>
            <div className='grid gap-3 items-center w-1/2 mx-auto'>
                {/* Entrada do E-mail */}
                <div className='form-control'>
                    <div className='relative'>
                        <input type='email' placeholder='E-mail de Utilizador'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={formData.email} onChange={(e) => {setFormData({...formData, email:e.target.value})}}/>
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <Mail className='size-5' />
                        </div>
                    </div>
                </div>

                {/* Entrada da password*/}
                <div className='form-control'>
                    <div className='relative'>
                        <input type='password' placeholder='Palavra-Passe'
                         className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200'
                         value={formData.password} onChange={(e) => {setFormData({...formData, password:e.target.value})}}/> 
                        
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                            <KeyRound className='size-5' />
                        </div>
                    </div>
                </div>

                {/* Botao de confirmacao */}
                <button className='btn btn-primary btn-outline'
                 type='submit' disabled={loading}>
                  {loading ? "A carregar..." : "Iniciar sessão"}
                </button>
            </div>

        </form>
    </main>
  )
}

export default ExplicLoginPage
