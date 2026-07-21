import React, { useEffect } from 'react'
import { useAuth } from '../../constants/useAuth'

function UserPayments() {
  const {loading, pagamentosData, getPagamentosData} = useAuth()
  useEffect(() => {
    getPagamentosData()
  },[])
  const dataFormat = (data) =>{
    return data.slice(0,10)
  }

  return (
    <div className='card bg-base-100 shadow-lg'>
      <div className='card-body'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>
            Pagamentos
          </h2>

          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data de Vencimento</th>
                  <th>Data de Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {/* Parte de mostrar pagamentos do utilizador */}
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <span className="loading loading-spinner loading-lg" />
                    </td>
                  </tr>
                ) : (
                  pagamentosData.map(pagamento => (
                    <tr>
                      <td>{pagamento.tipo}</td>
                      <td>{pagamento.valor}€</td>
                      <td>{dataFormat(pagamento.data_vencimento)}</td>
                      <td>{pagamento.data_pago == null ? "-" : dataFormat(pagamento.data_pago)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserPayments
