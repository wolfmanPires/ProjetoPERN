import React, { useEffect } from 'react'
import { useAuth } from '../../constants/useAuth'
import { PlusCircleIcon, SquarePen } from 'lucide-react'
import { gestorAuth } from '../../constants/gestorAuth'
import AddNotaModal from '../Modals/GestorNotas/AddNotaModal'
import { useState } from 'react'
import AddNotaExplicandoModal from '../Modals/AddNotaExplicandoModal'
import ChoosePessoaModal from '../Modals/choosePessoaModal'

function UserNotas() {
  const {loading, user, explicando, notasData, explicData, checkExplicacoes, getNotasExplicando, getNotasExplicador, getExplicandoFromUser} = useAuth()
  const {setNewNota, newNota} = gestorAuth()
  const [notaRecebida, setNotaRecebida] = useState(-1)
  const [filtroPessoa, setFiltroPessoa] = useState('');
  useEffect(() => {
    checkExplicacoes()

    if(user.tipo === "explicador"){
      getNotasExplicador()
    }else{
      getNotasExplicando()
      getExplicandoFromUser()
    }
  },[])
  const dataFormat = (data) =>{
    return data.slice(0,16)
  }

  const notasFilter = notasData.filter(nota => {
    if (!filtroPessoa) return true

    return nota.nome_explicando === filtroPessoa
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
                  Notas dos Explicandos
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
                      <th>Valor</th>
                      <th>Explicando</th>
                      <th>Disciplina</th>
                      <th>Ano Curricular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Parte de mostrar avaliacoes futuras dos explicandos */}
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          <span className="loading loading-spinner loading-lg" />
                        </td>
                      </tr>
                    ) : (
                      notasFilter.map(nota => (
                        <tr>
                          <td>{dataFormat(nota.data_avaliacao)}</td>
                          <td>{nota.valor}</td>
                          <td>{nota.nome_explicando}</td>
                          <td>{nota.nome_disciplina}</td>
                          <td>{nota.ano}</td>
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
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Notas
                  </h2>

                  <div className='flex justify-end'>
                    <button className='btn btn-primary rounded-full ml-6' onClick={() => document.getElementById("addNotaExplicandoModal").showModal()}>
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
                      <th>Valor</th>
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
                      notasData.map(nota => (
                        <tr>
                          <td>{dataFormat(nota.data_avaliacao)}</td>
                          <td>{nota.valor}</td>
                          <td>{nota.nome_disciplina}</td>
                          <td>{nota.ano}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <AddNotaExplicandoModal id_avalFutura={notaRecebida}/>
          <ChoosePessoaModal listPessoas={allPessoas} onSelectPessoa={(selectPessoa) => {setFiltroPessoa(selectPessoa)}}/>
        </section>
      </div>
    </div>
  )
}

export default UserNotas
