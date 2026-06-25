import React from 'react'

function GestorProfile() {
  return (
    <main className='mx-auto w-full'>
      {/* Sidebar com componentes para os gestores navegar */}
      <div className='drawer lg:drawer-open'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle'/>
        <div className='drawer-content flex flex-col items-center justify-center'>
          {/* Botao de abrir sidebar para ecras pequenos (telemoveis) */}
          <label htmlFor='my-drawer' className='btn drawer-button btn-primary lg:hidden'>
            Abrir menu
          </label>
        </div>

        <div className='drawer-side'>
          <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
          <ul className='menu bg-base-200 min-h-full w-80 p-4'>
            {/* Tabs do sidebar sao inseridas aqui */}
            <li><a>Geral</a></li>
            <li><a>Explicações</a></li>
            <li><a>Explicadores</a></li>
            <li><a>Explicandos</a></li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default GestorProfile
