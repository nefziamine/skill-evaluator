import React, { useState } from 'react'
import { Container, Typography, Grid, Paper, Button, Stack, Switch, Box, alpha, useTheme } from '@mui/material'
import { CheckCircleOutline, AutoAwesome, RocketLaunch, Groups } from '@mui/icons-material'
import MarketingLayout from '../components/MarketingLayout'
import axios from 'axios'

const tiers = [
  {
    name: 'Free',
    id: 'FREE',
    icon: <CheckCircleOutline />,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individuals getting started with technical assessments.',
    features: [
      '5 skill evaluations / month',
      'Basic AI assessment',
      'Community support',
      'Public profile badge'
    ],
    cta: 'Get Started',
    featured: false
  },
  {
    name: 'Pro',
    id: 'PRO',
    icon: <RocketLaunch />,
    monthlyPrice: 29,
    annualPrice: 290,
    description: 'Advanced features for scaling recruitment teams.',
    features: [
      'Unlimited assessments',
      'Advanced AI (GPT-4)',
      'Priority email support',
      'Anti-cheat proctoring',
      'API access (100 req/day)'
    ],
    cta: 'Try Pro Free',
    featured: true,
    popular: true
  },
  {
    name: 'Enterprise',
    id: 'ENTERPRISE',
    icon: <Groups />,
    monthlyPrice: 99,
    annualPrice: 990,
    description: 'Custom solutions for large organizations.',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'Dedicated manager',
      'SAML/SSO integration',
      'Unlimited API access'
    ],
    cta: 'Contact Sales',
    featured: false
  }
]

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true)
  const theme = useTheme()
  const [loading, setLoading] = useState(null)

  React.useEffect(() => {
    // Check for pending subscription after login
    const pendingSub = localStorage.getItem('pendingSubscription')
    const token = localStorage.getItem('token')

    if (pendingSub && token) {
      const { tierId, cadence } = JSON.parse(pendingSub)
      localStorage.removeItem('pendingSubscription')
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        handleSubscription(tierId, cadence === 'annual')
      }, 500)
    }
  }, [])

  const handleSubscription = async (tierId, forcedCadence = null) => {
    const activeCadence = forcedCadence !== null ? forcedCadence : isAnnual
    if (tierId === 'FREE') {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('userRole')
      if (token) {
        window.location.href = role === 'ADMIN' ? '/admin/dashboard' : '/recruiter/dashboard'
      } else {
        window.location.href = '/register'
      }
      return
    }

    if (tierId === 'ENTERPRISE') {
      window.location.href = '/contact'
      return
    }

    setLoading(tierId)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Save choice to resume after login
        localStorage.setItem('pendingSubscription', JSON.stringify({
          tierId,
          cadence: activeCadence ? 'annual' : 'monthly'
        }))
        window.location.href = `/login?redirect=pricing`
        return
      }

      // Redirect to the new Payment Methods management page
      window.location.href = '/recruiter/billing'
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <MarketingLayout>
      <Box sx={{ 
        bgcolor: '#020617', 
        minHeight: '100vh', 
        pt: 15, pb: 10,
        background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05), transparent 50%)' 
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em' }}>
              Pricing that scales with <span style={{ color: theme.palette.primary.main }}>your talent</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
              Choose the plan that fits your growth. Save 17% with annual billing.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
              <Typography sx={{ color: isAnnual ? 'text.secondary' : 'text.primary', fontWeight: 600 }}>Monthly</Typography>
              <Switch 
                checked={isAnnual} 
                onChange={() => setIsAnnual(!isAnnual)} 
                color="primary"
              />
              <Typography sx={{ color: !isAnnual ? 'text.secondary' : 'text.primary', fontWeight: 600 }}>
                Annual <Box component="span" sx={{ 
                  ml: 1, 
                  px: 1.5, 
                  py: 0.5, 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  color: 'success.main', 
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>2 MONTHS FREE</Box>
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={4} alignItems="flex-end">
            {tiers.map((tier) => (
              <Grid item xs={12} md={4} key={tier.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    height: '100%',
                    borderRadius: 8,
                    bgcolor: alpha('#1e293b', 0.4),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: tier.featured ? 'primary.main' : alpha('#fff', 0.1),
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      borderColor: tier.featured ? 'primary.main' : alpha('#fff', 0.3),
                      bgcolor: alpha('#1e293b', 0.6),
                    }
                  }}
                >
                  {tier.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 3,
                      py: 0.5,
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: 1
                    }}>
                      MOST POPULAR
                    </Box>
                  )}

                  <Box sx={{ color: tier.featured ? 'primary.main' : 'text.secondary', mb: 3 }}>
                    {tier.icon}
                  </Box>
                  
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    {tier.name}
                  </Typography>
                  
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h3" fontWeight={900}>
                      ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      /{isAnnual ? 'year' : 'month'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, minHeight: 40 }}>
                    {tier.description}
                  </Typography>

                  <Divider sx={{ mb: 4, borderColor: alpha('#fff', 0.05) }} />

                  <Stack spacing={2} sx={{ mb: 6 }}>
                    {tier.features.map((feature) => (
                      <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleOutline sx={{ color: 'primary.main', fontSize: 18 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant={tier.featured ? 'contained' : 'outlined'}
                    size="large"
                    disabled={loading === tier.id}
                    onClick={() => handleSubscription(tier.id)}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontWeight: 800,
                      fontSize: '1rem',
                      ...(tier.featured ? {
                        boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      } : {
                        borderColor: alpha('#fff', 0.2),
                        color: 'white',
                      })
                    }}
                  >
                    {loading === tier.id ? 'Processing...' : tier.cta}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={10}>
            <Typography variant="body1" color="text.secondary">
              Need a custom plan for a large team? <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}>Talk to us.</Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </MarketingLayout>
  )
}

const Divider = ({ sx }) => <Box sx={{ borderBottom: '1px solid', ...sx }} />

export default Pricing
