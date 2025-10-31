import Navbar from './Components/Navbar'
import { Route, Routes, useLocation, useParams, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ExperienceDetails from './pages/ExperienceDetails'
import Footer from './Components/Footer'
import { Toaster } from 'react-hot-toast'
import Checkout from './pages/Checkout'
import BookingConfirmation from './pages/BookingConfirmation'

const App = () => {
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  // Legacy redirect: some older links use /car-details/:id — redirect them to /experience/:id
  const LegacyCarRedirect = () => {
    const { id } = useParams();
    return <Navigate to={`/experience/${id}`} replace />
  }

  return (
    <>
      <Toaster />

        <Navbar />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<LegacyCarRedirect />} />
        <Route path='/experience/:id' element={<ExperienceDetails />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/checkout/:id' element={<Checkout />} />
        <Route path='/booking-confirmation' element={<BookingConfirmation />} />

      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App