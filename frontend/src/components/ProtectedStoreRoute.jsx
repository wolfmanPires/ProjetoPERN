import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiWithCreds from '../constants/axiosWithCreds';

//Usar para paginas que necessitam de autenticacao;
//Se esta autenticado, pode continuar;
//Se nao, mandar para pagina de login.

function ProtectedStoreRoute({children}) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //Login feito, continuar na pagina
        const resp = await apiWithCreds.get("/api/activeStoreSession/activeStoreUser")
        setAuthed(true)
      } catch {
        //Login nao feito, mandar para pagina de login
        setAuthed(false)
      } finally {
        //Acabar processo
        setLoading(false)
      }
    };

    checkAuth();
  }, [])

    if(loading){
        return(
            <div className='flex justify-center items-center h-64'>
              <div className='loading loading-spinner loading-lg' />
              A Carregar
            </div>
        )
    }

    if(!authed){
        return <Navigate to="/storeLogin" replace/>
    }

    return children;
}

export default ProtectedStoreRoute
