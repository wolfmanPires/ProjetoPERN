import React, { useEffect } from 'react'
import { useAuth } from '../../constants/useAuth'
import { PlusCircleIcon, SquarePen } from 'lucide-react'
import { gestorAuth } from '../../constants/gestorAuth'
import AddNotaModal from '../Modals/GestorNotas/AddNotaModal'
import { useState } from 'react'
import AddAvalFuturaExplicandoModal from '../Modals/AddAvalFuturaExplicandoModal'
import ChoosePessoaModal from '../Modals/ChoosePessoaModal'

function UserAvalFuturas() {
  const {loading, user, explicando, avalFuturasData, explicData, getAvalFuturasExplicando, getAvalFuturasExplicador, getExplicandoFromUser, checkExplicacoes} = useAuth()
  const {setNewNota, newNota} = gestorAuth()
  const [notaRecebida, setNotaRecebida] = useState(-1)
  const [filtroPessoa, setFiltroPessoa] = useState('');
  useEffect(() => {
    checkExplicacoes()
    if(user.tipo === "explicador"){
      getAvalFuturasExplicador()
    }else{
      getAvalFuturasExplicando()
      getExplicandoFromUser()
    }
  },[])
  const dataFormat = (data) =>{
    return data.slice(0,16)
  }
  const handleNota = (avalFut) => {
    setNewNota({
      data_avaliacao: avalFut.data,
      descricao: avalFut.descricao,
      valor: "",
      id_disciplina: avalFut.id_disciplina,
      id_explicando: avalFut.id_explicando
    })
    setNotaRecebida(avalFut.id_avaliacoes)
    document.getElementById("addNotaModal").showModal()
  }

  const avalFuturasFilter = avalFuturasData.filter(avalFut => {
    if (!filtroPessoa) return true

    return avalFut.nome_explicando === filtroPessoa
  })

  const allPessoas = [...new Set(
    explicData.map(explic => explic.nome)
  )]

  return (
    <div className='card bg-base-100 shadow-lg'>
      <div className='card-body'>
        <section>
          {user.tipo === "explicador" && (
            <div>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>
                  Avaliações Futuras dos Explicandos
                </h2>

                <div className='flex justify-end text-lg'>
                  <button className={`btn btn-sm ${(filtroPessoa !== '') ? ('btn-primary') : ('btn-outline')}`} popoverTarget='dropdownFiltroExplic'>
                    Filtrar
                  </button>
                  <ul className='dropdown dropdown-bottom dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm' popover='auto' id='dropdownFiltroExplic'>
                    <div className='w-full'>
                      <li className='flex items-center menu-title'>
                        <span>Por Explicando:</span>
                      </li>

                      <li><button className={`btn btn-sm ${(filtroPessoa === '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {setFiltroPessoa('');}}>
                        Todos Explicandos
                      </button></li>

                      <li><button className={`btn btn-sm ${(filtroPessoa !== '') ? ('btn-primary') : ('btn-outline')}`} onClick={() => {document.getElementById("choosePessoaModal").showModal()}}>
                        Procurar Explicando
                      </button></li>
                    </div>
                    
                  </ul>
                </div>
              </div>
              
              <div className='overflow-x-auto'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Data e Hora</th>
                      <th>Explicando</th>
                      <th>Disciplina</th>
                      <th>Ano Curricular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Parte de mostrar avaliacoes futuras dos explicandos */}
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          <span className="loading loading-spinner loading-lg" />
                        </td>
                      </tr>
                    ) : (
                      avalFuturasFilter.map(avalFut => (
                        <tr>
                          <td>{dataFormat(avalFut.data)}</td>
                          <td>{avalFut.nome_explicando}</td>
                          <td>{avalFut.nome_disciplina}</td>
                          <td>{avalFut.ano}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {user.tipo === "explicando" && (
            <div>
              <div className='grid grid-cols-2'>
                <h2 className='text-xl font-semibold mb-4'>
                  Avaliações Futuras
                </h2>

                <div className='flex justify-end'>
                  <button className='btn btn-primary rounded-full ml-6' onClick={() => document.getElementById("addAvalFuturaExplicandoModal").showModal()}>
                    <PlusCircleIcon className='size-5 mr-2' />
                    Adicionar
                  </button>
                </div>
              </div>
              
              
              <div className='overflow-x-auto'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Data e Hora</th>
                      <th>Disciplina</th>
                      <th>Ano Curricular</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Parte de mostrar avaliacoes futuras dos explicandos */}
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          <span className="loading loading-spinner loading-lg" />
                        </td>
                      </tr>
                    ) : (
                      avalFuturasData.map(avalFut => (
                        <tr>
                          <td>{dataFormat(avalFut.data)}</td>
                          <td>{avalFut.disciplina_nome}</td>
                          <td>{avalFut.ano}</td>
                          <td>
                            <div className='flex gap-2'>
                              {/* Botao de editar */}
                              <button className='btn btn-warning btn-sm' onClick={() => handleNota(avalFut)}>
                                <SquarePen className='size-4' /> Tornar em Nota
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <AddAvalFuturaExplicandoModal id_explicando={explicando.id_explicando}/>
            </div>
          )}
          <AddNotaModal id_avalFutura={notaRecebida}/>
          <ChoosePessoaModal listPessoas={allPessoas} onSelectPessoa={(selectPessoa) => {setFiltroPessoa(selectPessoa)}}/>
        </section>
      </div>
    </div>
  )
}

export default UserAvalFuturas
