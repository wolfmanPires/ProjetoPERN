import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

{/* Componente do botao de voltar atras */}
function BackButton() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        {/* Verifica se a pagina anterior e do site ou nao */}
        const isInternalReferrer = document.referrer && document.referrer.startsWith(window.location.origin)

        {/* Caso sim, volta para ela, caso nao, vai para a pagina principal do site (sim e um dark pattern) */}
        if (isInternalReferrer){
            navigate(-1)
        }else{
            navigate("/")
        }
    }

  return (
    <div className='mb-6'>
        <button className='btn btn-ghost rounded-full' onClick={handleGoBack}>
          <ChevronLeft className='size-8'/>
          <div className='text-lg'>Voltar</div>
        </button>
      </div>
  )
}

export default BackButton
