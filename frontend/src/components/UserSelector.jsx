import { CircleUserRound } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../constants/useAuth';


function UserSelector() {
  const navigate = useNavigate();
  const {user, loading, checkUser} = useAuth();
  useEffect(() => {
    checkUser()
  },[])
  const handleClick = () => {
    {/* Verifica se ja existe sessao iniciada. Caso sim, vai para o perfil do utilizador, caso nao, vai para a pagina de login */}
    if (user){
      navigate("/userProfile")
    }else{
      navigate("/userLogin")
    }
  }
  
  return (
    <div className='flex justify-between items-center'>
      <button className='btn btn-ghost rounded-full' onClick={handleClick} disabled={loading}>
        <CircleUserRound className='size-5'/> {/* w-5 h-5 */} 
        {
          loading ? 'A carregar' : user ? user.nome : 'Iniciar Sessão'
        }
      </button>
    </div>
  )
}

export default UserSelector