import { PaletteIcon } from 'lucide-react'
import React from 'react'
import { THEMES } from '../constants/themes'
import { useTheme } from '../../globals/useTheme';

function ThemeSelector() {
  const {theme, setTheme} = useTheme();
  
  return (
    <div className='dropdown dropdown-end'>
        {/* Menu de Dropdown - Gatilho de (Des)Ativacao */}
        <button tabIndex={0} className='btn btn-ghost btn-circle'>
            <PaletteIcon className='size-5'/> {/* w-5 h-5 */}            
        </button>

        <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 bordeer border-base-content/10'>
            {THEMES.map(themeOption => (
              <button key={themeOption.name} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors 
              ${theme === themeOption.name ? "bg-primary/10  text-primary" : "hover:bg-base-content/5"}`} onClick={() => setTheme(themeOption.name)}>

                {/* Identificacao do Tema */}
                <PaletteIcon className='size-4'/>
                <span className='text-sm font-medium'>{themeOption.label}</span>

                {/* Amostras das Cores do Tema */}
                <div className='ml-auto flex gap-1'>
                  {themeOption.colors.map(color => (
                    <span key={color} className='size-2 rounded-full' style={{backgroundColor: color}}></span>
                  ))}
                </div>
              </button>
            ))}
        </div>
    </div>
  )
}

export default ThemeSelector
