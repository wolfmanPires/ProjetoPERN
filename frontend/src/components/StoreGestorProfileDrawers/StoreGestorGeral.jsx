import React, { useEffect } from 'react'
import { doLogin } from '../../constants/loginRegister'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../constants/useAuthStore'
import { gestorAuthStore } from '../../constants/gestorAuthStore'
import {ShoppingBag,Users,Package,Euro,AlertTriangle,Clock3} from "lucide-react";

function StoreGestorGeral() {
  const {userStore} = useAuthStore()
  const { dashboard, loading, getDashboard } = gestorAuthStore();
  const {logout} = doLogin()
  const navigate = useNavigate()
  const hoje = new Date()
  //Tratar do botao de logout
  const handleLogout = async () => {
    await logout()
    navigate("/storeLogin")
  } 

  //Funcao que escreve introdução ao utilizador, dependente da hora do dia
  const greeting = () => {
    if(hoje.getHours()>=6 && hoje.getHours()<12){
      return `Bom dia ${userStore.nome}!`
    }else if(hoje.getHours()>=12 && hoje.getHours()<19){
      return `Boa tarde ${userStore.nome}!`
    }else{
      return `Boa noite ${userStore.nome}!`
    }
  }

  useEffect(() => {
    getDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  

    

  return (
    <div className='w-full'>
      {/* Barra de acolhimento / botao de logout */}
      <div className='shrink-0 w-full px-8 pt-4'>
        <div className='grid grid-cols-2 w-full mb-4 '>
          <h1 className='text-xl font-bold flex items-center'>
            Perfil de Gestão - {greeting()}
          </h1>

          {/* Botao de logout */}
          <div className='flex justify-end'>
            <button className='btn btn-error' onClick={handleLogout}>Terminar Sessão</button>
          </div>
        </div>

      {/* Cards superiores */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <ShoppingBag className="size-8"/>
              <h2 className="text-lg">
                Produtos
              </h2>

              <p className="text-4xl font-bold">
                {dashboard.totalProdutos}
              </p>

            </div>
        </div>

        <div className="card bg-secondary text-secondary-content shadow-xl">
          <div className="card-body">
            <Users className="size-8"/>
            <h2 className="text-lg">
              Clientes
            </h2>

            <p className="text-4xl font-bold">
              {dashboard.totalClientes}
            </p>
          </div>
        </div>

                <div className="card bg-accent text-accent-content shadow-xl">
                    <div className="card-body">

                        <Package className="size-8"/>

                        <h2 className="text-lg">
                            Encomendas
                        </h2>

                        <p className="text-4xl font-bold">
                            {dashboard.totalEncomendas}
                        </p>

                    </div>
                </div>

                <div className="card bg-success text-success-content shadow-xl">
                    <div className="card-body">

                        <Euro className="size-8"/>

                        <h2 className="text-lg">
                            Receita
                        </h2>

                        <p className="text-4xl font-bold">
                            {dashboard.receitaTotal}€
                        </p>

                    </div>
                </div>

            </div>

            {/* Linha intermédia */}

            <div className="grid gap-6 xl:grid-cols-2">

                {/* Últimas encomendas */}

                <div className="card bg-base-100 shadow-lg">

                    <div className="card-body">

                        <div className="flex items-center gap-2">

                            <Clock3 className="text-primary"/>

                            <h2 className="card-title">
                                Últimas encomendas
                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="table table-zebra">

                                <thead>

                                    <tr>

                                        <th>Cliente</th>

                                        <th>Total</th>

                                        <th>Estado</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboard.ultimasEncomendas.map(enc => (

                                        <tr key={enc.id_encomenda}>

                                            <td>

                                                {enc.nome_cliente}

                                            </td>

                                            <td>

                                                {enc.total}€

                                            </td>

                                            <td>

                                                <span className="badge badge-primary">

                                                    {enc.estado}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* Stock baixo */}

                <div className="card bg-base-100 shadow-lg">

                    <div className="card-body">

                        <div className="flex items-center gap-2">

                            <AlertTriangle className="text-warning"/>

                            <h2 className="card-title">

                                Produtos com pouco stock

                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="table table-zebra">

                                <thead>

                                    <tr>

                                        <th>Produto</th>

                                        <th>Stock</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboard.stockBaixo.map(prod => (

                                        <tr key={prod.id_products}>

                                            <td>

                                                {prod.name}

                                            </td>

                                            <td>

                                                <span className="badge badge-warning">

                                                    {prod.stock}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            </div>

      </div>
    </div>
  )
}

export default StoreGestorGeral
