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

function App() {
  const {theme} = useTheme();
  const {pathname} = useResolvedPath();
  {/* Usado para definir a Navbar para paginas especificas */}
  const navbarRoutes = ["/","/store","/userProfile","/gestorProfile"]
  const hasNavbar = 
    navbarRoutes.includes(pathname) ||
    pathname.startsWith("/product/")

  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300' data-theme={theme}>
      {hasNavbar && <NavBar/>}
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <CalendarHomePage/>
          </ProtectedRoute>
        } />
        <Route path='/store' element={<StoreHomePage/>} />
        <Route path='/product/:id' element={<ProductPage/>} />
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
      </Routes>
      <Toaster />
    </div>
  )
}

export default App