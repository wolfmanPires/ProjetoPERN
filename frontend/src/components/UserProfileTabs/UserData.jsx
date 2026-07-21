import React, { useEffect, useState } from 'react'
import { useAuth } from '../../constants/useAuth'
import toast from "react-hot-toast"

function UserData() {
  const {loading, user, extraData, getProfileData, getPagamentosData, getExplicandoFromUser, updateProfile} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user.nome || "",
    email: user.email || "",
    telemovel: user.telemovel || "",
    tipo: user.tipo || "",
    password: "",
    confirmarPassword: "",
    especialidades: extraData.especialidades || "",
    habilitacoes: extraData.habilitacoes || "",
    dificuldades: extraData.dificuldades || ""
  });
  useEffect(() => {
    getProfileData()
    getPagamentosData()
    getExplicandoFromUser()
  },[])

  const cancelarEdicao = () => {
    setIsEditing(false);

    setFormData({
      nome: user.nome,
      email: user.email,
      telemovel: user.telemovel,
      tipo: user.tipo,
      password: "",
      confirmarPassword: "",
      especialidades: extraData.especialidades || "",
      habilitacoes: extraData.habilitacoes || "",
      dificuldades: extraData.dificuldades || ""
    });
  };

  const guardarDados = async () => {

    if (formData.password && formData.password !== formData.confirmarPassword){
      toast.error("As palavras-passe não coincidem.");
      return;
    }
    const success = await updateProfile(formData);
    if(success){
      setIsEditing(false);
      getProfileData();
    }
  }

  return (
    <div className='card bg-base-100 shadow-lg'>
      <div className='card-body'>
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className='text-xl font-semibold mb-4'>
              Dados de Utilizador
            </h2>

            {!isEditing ? (
              <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)} >
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="btn btn-success btn-sm" onClick={guardarDados} >
                  Guardar
                </button>

                <button className="btn btn-outline btn-sm" onClick={cancelarEdicao} >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          

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
                  <input type="text" className='input input-bordered w-full' value={formData.nome} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, nome: e.target.value})} />
                </div>

                {/* Email */}
                <div>
                  <label className='label'>
                    <span className='label-text' >E-mail</span>
                  </label>
                  <input type="email" className='input input-bordered w-full' value={formData.email} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, email: e.target.value})} />
                </div>

                {/* Telemovel */}
                <div>
                  <label className='label'>
                    <span className='label-text' >Telemóvel</span>
                  </label>
                  <input type="tel" className='input input-bordered w-full' value={formData.telemovel} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, telemovel: e.target.value})} />
                </div>

                {isEditing && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text">
                            Nova Palavra-passe
                        </span>
                      </label>

                      <input type="password" className="input input-bordered w-full" value={formData.password} onChange={(e)=> setFormData({...formData, password:e.target.value})}/>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">
                          Confirmar Palavra-passe
                        </span>
                      </label>

                      <input type="password" className="input input-bordered w-full" value={formData.confirmarPassword} onChange={(e)=> setFormData({...formData, confirmarPassword:e.target.value})}/>
                    </div>
                  </>
                )}

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
                        <input type="text" className='input input-bordered w-full' value={formData.especialidades} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, especialidades: e.target.value})} />
                      </div>

                      {/* Habilitacoes */}
                      <div>
                        <label className='label'>
                          <span className='label-text' >Habilitações</span>
                        </label>
                        <input type="text" className='input input-bordered w-full' value={formData.habilitacoes} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, habilitacoes: e.target.value})} />
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
                            <input type="text" className='input input-bordered w-full' value={formData.dificuldades} readOnly={!isEditing} onChange={(e)=> setFormData({...formData, dificuldades: e.target.value})} />
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
