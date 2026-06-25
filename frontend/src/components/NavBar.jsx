import React from 'react'
import { Link, useResolvedPath } from 'react-router-dom'
import logotipo from "../assets/ASASbgless.png"
import { ShoppingBagIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '../../globals/useTheme';
import UserSelector from './UserSelector';

function NavBar() {
  const {pathname} = useResolvedPath();
  const isHomePage = pathname === "/store";

  return (
    <div className='bg-base-100/80 backdrop-blur-lg border-base-content/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='navbar px-4 min-h-8 justify-between'>
            {/* Logotipo */}
            <div className='flex-1 lg:flex-none'>
                <Link to="/" className='hover:opacity-60 transition-opacity'>
                    <div className='flex items-center gap-2'>
                        <img src={logotipo} alt='Logotipo ASAS' className='max-h-24'/>
                    </div>
                </Link>
            </div>

            {/* Temas e Carrinho de Compras*/}
            <div className='flex items-center gap-4'>
              <ThemeSelector />
              <UserSelector />

              {isHomePage && (
                <div className='indicator'>
                  <div className='p-2 rounded-full hover:bg-base-200 transition-colors'>
                    <ShoppingBagIcon className='size-5' />
                    <span className='badge badge-sm badge-primary indicator-item'>
                      8 {/*{products.length}*/}
                    </span>
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
