import React, { useEffect, useState } from 'react'
import { useAuth } from '../../constants/useAuth'

function ChoosePessoaModal({listPessoas,onSelectPessoa}) {
  const {user} = useAuth()
  const [pessoa, setPessoa] = useState("")

  useEffect(() => {
    if(listPessoas.length>0){
      setPessoa(listPessoas[0])
    }
  },[])

  const customSubmit = (e) => {
    e.preventDefault();
    onSelectPessoa(pessoa);
    document.getElementById("choosePessoaModal").close();
  }

  return (
    <dialog id='choosePessoaModal' className='modal'>
      <div className='modal-box'>
        {/* Botao de Fecho */}
        <form method="dialog">
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
        </form>

        <h3 className='text-xl font-semibold mb-4'>
          {user.tipo === 'explicador' && 'Escolha o explicando a procurar:'}
          {user.tipo === 'explicando' && 'Escolha o explicador a procurar:'}
        </h3>

        <form onSubmit={customSubmit} className='space-y-6'>
          <select className='select select-bordered w-full' value={pessoa} onChange={(e) => setPessoa(e.target.value)}>
            {listPessoas.map((nome)=>(
              <option key={nome}  value={nome}>{nome}</option>
            ))}
          </select>

          {/* Botao de confirmar */}
          <div className='modal-action'>
              <button type='submit' className='btn btn-primary min-w-30'>
                {user.tipo === 'explicador' && 'Confirmar Explicando'}
                {user.tipo === 'explicando' && 'Confirmar Explicador'}
                {user.tipo === 'gestor' && 'Confirmar Utilizador'}
              </button>
          </div>
        </form>

        {/* Backdrop - Faz fechar modal quando carregar fora da pagina*/}
        <form method="dialog" className='modal-backdrop'>
          <button>Fechar</button>
        </form>
      </div>
    </dialog>
  )
}

export default ChoosePessoaModal
