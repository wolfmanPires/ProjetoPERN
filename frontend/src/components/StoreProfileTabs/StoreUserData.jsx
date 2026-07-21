import React from 'react'
import { useAuthStore } from '../../constants/useAuthStore';

function StoreUserData() {
  const {loading, userStore} = useAuthStore();
  
    return (
      <div className='card bg-base-100 shadow-lg'>
        <div className='card-body'>
          <section>
            <h2 className='text-xl font-semibold mb-4'>
              Dados de Utilizador
            </h2>
  
            {loading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='loading loading-spinner loading-lg' />
              </div>
            ) : (
              <div>
                <div className='grid gap-4 md:grid-cols-2'>
                  {/* Nome do Utilizador */}
                  <div>
                    <label className='label'>
                      <span className='label-text' >Nome</span>
                    </label>
                    <input type="text" className='input input-bordered w-full' value={userStore.nome} readOnly />
                  </div>
  
                  {/* Email */}
                  <div>
                    <label className='label'>
                      <span className='label-text' >E-mail</span>
                    </label>
                    <input type="email" className='input input-bordered w-full' value={userStore.email} readOnly />
                  </div>
  
                  {/* Telemovel */}
                  <div>
                    <label className='label'>
                      <span className='label-text' >Telemóvel</span>
                    </label>
                    <input type="tel" className='input input-bordered w-full' value={userStore.telemovel} readOnly />
                  </div>

                </div>
  
              </div>
  
            )}
  
          </section>
        </div>
      </div>
    )
}

export default StoreUserData
