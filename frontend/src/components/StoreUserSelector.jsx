import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../constants/useAuthStore';
import { CircleUserRound, ShoppingBasket, ShoppingCart } from 'lucide-react';

function StoreUserSelector() {
  const {loading, error, userStore, checkUserStore, gestor, checkGestor} = useAuthStore()
  const navigate = useNavigate();
  useEffect(() => {
    checkUserStore()
    checkGestor()
  },[])
  const handleClick = async () => {
    {/* Verifica se ja existe sessao iniciada. Caso sim, vai para o perfil do utilizador, caso nao, vai para a pagina de login */}
    if (!userStore){
      navigate("/storeLogin")
    }else {
      if(gestor){
        navigate("/store/storeGestor")
      }else{
        navigate("/store/userPage")
      }
    }
  }

  //Ajuda a aplicar formatacao adaptavel ao formato de ecra
  const textoConta = loading ? "A carregar" : userStore ? userStore.nome : "Conta Cliente";

  return (
    <div className='flex justify-between items-center'>
      <button className='btn btn-ghost rounded-full' onClick={handleClick} disabled={loading}>
        <ShoppingBasket className='size-5 hidden sm:block'/> {/* w-5 h-5 */} 
        <div className=''>
          {textoConta}
        </div>
      </button>
    </div>
  )
}

export default StoreUserSelector
