import { Routes, Route, useResolvedPath } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import StoreHomePage from './pages/StoreHomePage'
import ProductPage from './pages/ProductPage'
import { useTheme } from '../globals/useTheme'
import { Toaster } from 'react-hot-toast'
import CalendarHomePage from './pages/CalendarHomePage'
import ExplicLoginPage from './pages/ExplicLoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './pages/UserProfile'
import GestorProfile from './pages/GestorProfile'
import HomePage from './pages/HomePage'
import StoreGestorPage from './pages/StoreGestorPage'
import StoreLoginPage from './pages/StoreLoginPage'
import StoreProfile from './pages/StoreProfile'
import ProtectedStoreRoute from './components/ProtectedStoreRoute'
import StoreRegisterPage from './pages/StoreRegisterPage'
import ConfirmStoreEmailPage from './components/ConfirmStoreEmailPage'
import StoreCheckoutPage from './pages/StoreCheckoutPage'
import StoreEncomendaPage from './pages/storeEncomendaPage'
import WaitConfirmEmailPage from './components/WaitConfirmEmailPage'
import ResendConfirmEmail from './components/ResendConfirmEmail'
import StoreRecupPass from './pages/StoreRecupPass'
import StoreReporPass from './pages/StoreReporPass'
import StoreGestorProfile from './pages/StoreGestorProfile'

function App() {
  const {theme} = useTheme();
  const {pathname} = useResolvedPath();
  {/* Usado para definir a Navbar para paginas especificas */}
  const isStorePage = pathname.startsWith("/store")
  const navbarRoutes = ["/userProfile","/gestorProfile","/userHomePage"]
  const hasNavbar = isStorePage || navbarRoutes.includes(pathname)

  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300' data-theme={theme}>
      {hasNavbar && <NavBar/>}
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/userHomePage' element={
          <ProtectedRoute>
            <CalendarHomePage/>
          </ProtectedRoute>
        } />
        <Route path='/store' element={<StoreHomePage/>} />
        <Route path='/store/storeGestor' element={<StoreGestorPage/>} />
        <Route path='/store/productGestor/:id' element={<ProductPage/>} />
        <Route path='/userLogin' element={<ExplicLoginPage/>}/>
        <Route path='/userProfile' element={
          <ProtectedRoute>
            <UserProfile/>
          </ProtectedRoute>
        } />
        <Route path='/gestorProfile' element={
          <ProtectedRoute>
            <GestorProfile/>
          </ProtectedRoute>
        } />
        <Route path='/storeLogin' element={<StoreLoginPage/>} />
        <Route path='/store/userPage' element={
          <ProtectedStoreRoute>
            <StoreProfile/>
          </ProtectedStoreRoute>
        } />
        <Route path="/store/confirmar-email" element={<ConfirmStoreEmailPage />} />
        <Route path="/store/confirmacao-enviada" element={<WaitConfirmEmailPage />} />
        <Route path="/store/reenviar-confirmacao" element={<ResendConfirmEmail />}/>
        <Route path="/store/pedir-recuperacao-password" element={<StoreRecupPass />} />
        <Route path="/store/repor-password" element={<StoreReporPass />} />
        <Route path="/storeRegister" element={<StoreRegisterPage />} />
        <Route path="/store/checkout" element={
          <ProtectedStoreRoute>
            <StoreCheckoutPage />
          </ProtectedStoreRoute>
        } />
        <Route path="/store/encomenda/:id" element={
          <ProtectedStoreRoute>
            <StoreEncomendaPage />
          </ProtectedStoreRoute>
        }/>
        <Route path="/store/gestorProfile" element={
          <ProtectedStoreRoute>
            <StoreGestorProfile />
          </ProtectedStoreRoute>
        }/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App