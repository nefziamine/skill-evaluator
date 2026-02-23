import { Box } from '@mui/material'
import TopNav from '../pages/MainLanding/components/TopNav'
import Footer from './Footer'
import ParticlesBackground from '../pages/MainLanding/components/ParticlesBackground'

function MarketingLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#020617',
        color: 'white',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <ParticlesBackground />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <TopNav />
        <Box component="main" sx={{ flexGrow: 1, pt: 12, pb: 4 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default MarketingLayout

