import { Box, alpha } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import ParticlesBackground from '../pages/MainLanding/components/ParticlesBackground'

function Layout({ children }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#0f172a',
      color: 'white',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <ParticlesBackground />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout

