import React, { useEffect, useRef } from 'react'
import { Link, useResolvedPath, useNavigate } from 'react-router-dom'
import logotipo from "../assets/ASASbgless.png"
import logoPequeno from "../assets/iconASASbgless.png"
import { Minus, Plus, ShoppingBagIcon, ShoppingBasket, ShoppingCart, Trash2 } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../../globals/useTheme';
import UserSelector from './UserSelector';
import StoreUserSelector from './StoreUserSelector';
import { useAuthStore } from '../constants/useAuthStore';

function NavBar() {
  const {userStore, carrinho, carrinhoProducts, checkUserStore, getCarrinho, getProdutosCarrinho, changeQuantProductToCarrinho, deleteProductToCarrinho,
          isCartDrawerOpen, openCartDrawer, closeCartDrawer, toggleCartDrawer, clearCarrinho } = useAuthStore()
  const {pathname} = useResolvedPath();
  const isStorePage = pathname.startsWith("/store")
  const navRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    //Ler tamanho da navbar para medir de forma correta a sideBar para os gestores, e atualizar para telemoveis caso preciso
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navRef.current.offsetHeight}px`
      )
    })
    observer.observe(navRef.current)
    return () => observer.disconnect()
  },[])

  useEffect(() => {
    checkUserStore()
  },[checkUserStore])

  useEffect(() => {
    const checkForCarrinho = async () => {
      //Se houver cliente, ver carrinho
      if(!userStore) return

      //Se houver carrinho, ver produtos
      const carr =await getCarrinho()
      if(!carr) return

      //Se houver produtos associados ao carrinho, mostrar-los
      await  getProdutosCarrinho()
    }

    checkForCarrinho()
  },[userStore,getCarrinho,getProdutosCarrinho])

  //Funcao para aumentar quantidade do produto
  const aumentarQuantidade = async (product) => {
    const quantidadeAtual = Number(product.quantidade)
    const stockAtual = Number(product.stock)

    if (quantidadeAtual >= stockAtual) {
      return
    }

    await changeQuantProductToCarrinho(
      quantidadeAtual + 1,
      product.id_products
    )
  }

  //Funcao para diminuir quantidade do produto
  const diminuirQuantidade = async (product) => {
    const quantidadeAtual = Number(product.quantidade)

    //Caso quantidade seja 0, apagar produto
    if (quantidadeAtual <= 1) {
      await deleteProductToCarrinho(product.id_products)
      return
    }

    await changeQuantProductToCarrinho(
      quantidadeAtual - 1,
      product.id_products
    )
  }

  //Funcao a usar para limpar o carrinho de compras
  const handleLimparCarrinho = async () => {
    const success = await clearCarrinho()

    if (success) {
      closeCartDrawer()
    }
  }

  //Funcao a usar para passar para o checkout
  const handleComprar = () => {
    closeCartDrawer()
    navigate("/store/checkout")
  }

  //Funcao para calcular total a pagar
  const getCustoTotal = () => {
    return carrinhoProducts.reduce((total, product) => {
      const preco = Number(product.price) || 0
      const quantidade = Number(product.quantidade) || 0

      return total + preco * quantidade
    }, 0)
  }

  return (
    <div ref={navRef} className='bg-base-100/80 backdrop-blur-lg border-base-content/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className="navbar w-full min-w-0 px-1.5 sm:px-4 min-h-12 justify-between gap-1">
            {/* Logotipo */}
            <div className="flex min-w-0 items-center">
                <Link to="/" className='hover:opacity-60 transition-opacity'>
                    <div className='flex items-center gap-2'>
                      <img src={logoPequeno} alt='Logotipo ASAS' className='block md:hidden max-h-12 object-contain'/>
                      <img src={logotipo} alt='Logotipo ASAS' className='hidden md:block max-h-24 object-contain'/>
                    </div>
                </Link>

                {isStorePage ? (
                  <Link to="/store" className='flex items-center ml-4 md:ml-12 hover:opacity-60 transition-opacity'>
                    <ShoppingBasket className="size-5 sm:size-6" />
                    <h1 className='hidden md:block text-2xl'>Loja ASAS</h1>
                  </Link>
                ) : (
                  <Link to="/store" className='flex items-center ml-4 md:ml-12 hover:opacity-60 transition-opacity'>
                    <ShoppingBasket className="size-4 md:size-6" />
                    <h1 className='text-md md:text-2xl'>Loja ASAS</h1>
                  </Link>
                )}
                
            </div>

            {/* Temas e Carrinho de Compras*/}
            <div className='flex items-center ml-2 md:ml-4'>
              <ThemeSelector />
              {/* Area dos botoes de contas */}
              {isStorePage ? (
                <StoreUserSelector />
              ) : (
                <UserSelector />
              )}

              {/* Area de carrinho de compras */}
              {isStorePage && (
                <div className='drawer drawer-end'>
                  <input id="drawer-carrinho" type="checkbox" className="drawer-toggle" checked={isCartDrawerOpen} onChange={(e) => {
                    if(e.target.checked){
                      openCartDrawer()
                    }else{
                      closeCartDrawer()
                    }
                  }} />
                  <div className="drawer-content pl-4 md:pl-8">
                    {/* Botao de abrir sidebar do carrinho */}
                    <button htmlFor="drawer-carrinho" className='btn drawer-button btn-ghost rounded-full' onClick={openCartDrawer}>
                      <div className='indicator'>
                        <ShoppingCart className='size-5' />
                        <span className='badge badge-sm badge-primary indicator-item rounded-full'>
                          {carrinhoProducts.length}
                        </span>
                      </div>
                    </button>
                  </div>
                  <div className="drawer-side">
                    <button htmlFor="drawer-carrinho" aria-label="close sidebar" className="drawer-overlay" onClick={closeCartDrawer}></button>
                    <ul className="menu bg-base-200 h-full w-40 p-4 md:w-80">
                      {/* Mostrar produtos do carrinho aqui */}
                      {carrinhoProducts.length === 0 ? (
                        <div className='flex-1 flex flex-col items-center justify-center text-center px-4'>
                          <ShoppingCart className="size-12 text-primary mb-4" />
                          <p className='flex items-center justify-center text-center text-lg text-primary'>Carrinho vazio, escolha produtos para comprar!</p>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto">
                          <div className="flex flex-col gap-4">
                            {carrinhoProducts.map((product) => {
                              const quantidade = Number(product.quantidade)
                              const stock = Number(product.stock)
                              const chegouAoStock = quantidade >= stock

                              return (
                                <article key={product.id_products} className="card bg-base-100 shadow-md overflow-hidden">
                                  {/* Parte superior: imagem e nome */}
                                  <div className="grid grid-cols-2 min-h-28">
                                    <figure className="w-full h-full">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
                                    </figure>

                                    <div className="flex items-center justify-center p-3">
                                      <p className="font-semibold text-center wrap-break-words">
                                        {product.name}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Parte inferior: quantidade */}
                                  <div className="border-t border-base-300 p-3">
                                    <p className="text-sm text-base-content/60 text-center mb-2">
                                      Quantidade
                                    </p>

                                    <div className="flex items-center justify-center gap-3">
                                      <button type="button" className="btn btn-primary btn-sm btn-square" onClick={() => diminuirQuantidade(product)} aria-label={`Diminuir quantidade de ${product.name}`}>
                                        <Minus className="size-4" />
                                      </button>

                                      <span className="min-w-8 text-center text-lg font-bold">
                                        {quantidade}
                                      </span>

                                      <button type="button" className="btn btn-primary btn-sm btn-square" disabled={chegouAoStock} onClick={() => aumentarQuantidade(product)} aria-label={`Aumentar quantidade de ${product.name}`}>
                                        <Plus className="size-4" />
                                      </button>
                                    </div>

                                    {chegouAoStock && (
                                      <p className="text-xs text-warning text-center mt-2">
                                        Quantidade máxima disponível
                                      </p>
                                    )}

                                    <p className="text-sm text-base-content/60 text-center mb-2">
                                      Custo agrupado: {Number(product.price) * quantidade}
                                    </p>
                                  </div>
                                </article>
                              )
                            })}

                            <p className="text-lg text-base-content/60 text-center mb-2">
                              Custo total: {getCustoTotal().toFixed(2)} €
                            </p>
                            <button type='button' className='btn btn-warning' onClick={handleLimparCarrinho}>
                              <Trash2 className='size-4'/>
                              Limpar Carrinho
                            </button>
                            <button type='button' className='btn btn-primary' onClick={handleComprar}>
                              <ShoppingCart className='size-4'/>
                              Comprar
                            </button>
                          </div>
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
