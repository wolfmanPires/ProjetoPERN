import React, { useEffect } from 'react'
import { useAuth } from '../../constants/useAuth'

function UserData() {
  const {loading, user, extraData, getProfileData, getPagamentosData} = useAuth();
  useEffect(() => {
    getProfileData()
    getPagamentosData()
  },[])

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
                  <input type="text" className='input input-bordered w-full' value={user.nome} readOnly />
                </div>

                {/* Email */}
                <div>
                  <label className='label'>
                    <span className='label-text' >E-mail</span>
                  </label>
                  <input type="email" className='input input-bordered w-full' value={user.email} readOnly />
                </div>

                {/* Telemovel */}
                <div>
                  <label className='label'>
                    <span className='label-text' >Telemóvel</span>
                  </label>
                  <input type="tel" className='input input-bordered w-full' value={user.telemovel} readOnly />
                </div>

                </div>
                {/* Seccoes especificas para explicador/explicando */}
                {(user.tipo === "explicador") ? (
                  <div>
                    <h2 className='text-xl font-semibold mb-2 mt-2'>
                      Dados de Explicador  
                    </h2>

                    <div className='grid gap-4 md:grid-cols-2'>
                      {/* Especialidades */}
                      <div>
                        <label className='label'>
                          <span className='label-text' >Especialidades</span>
                        </label>
                        <input type="text" className='input input-bordered w-full' value={extraData.especialidades} readOnly />
                      </div>

                      {/* Habilitacoes */}
                      <div>
                        <label className='label'>
                          <span className='label-text' >Habilitações</span>
                        </label>
                        <input type="text" className='input input-bordered w-full' value={extraData.habilitacoes} readOnly />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {(user.tipo === "explicando") ? (
                      <div>
                        <h2 className='text-xl font-semibold mb-2 mt-2'>
                          Dados de Explicando 
                        </h2>
                        <div className='grid gap-4 md:grid-cols-2'>
                          {/* Dificuldades */}
                          <div>
                            <label className='label'>
                              <span className='label-text' >Dificuldades</span>
                            </label>
                            <input type="text" className='input input-bordered w-full' value={extraData.dificuldades} readOnly />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )
                }

            </div>

          )}

        </section>
      </div>
    </div>
  )
}

export default UserData
