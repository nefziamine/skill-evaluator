import { Container, Typography, Grid, Paper, Button, Stack } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

const plans = [
  {
    name: 'Starter',
    price: '$99',
    cadence: 'per month',
    highlight: 'For early teams hiring their first engineers.',
    features: ['Up to 20 test sessions / month', 'Core skill libraries', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$299',
    cadence: 'per month',
    highlight: 'For scale‑ups running a consistent hiring pipeline.',
    featured: true,
    features: [
      'Up to 100 test sessions / month',
      'Custom question banks',
      'ATS integrations',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Let’s talk',
    cadence: '',
    highlight: 'For global teams with advanced compliance and volume needs.',
    features: [
      'Unlimited assessments',
      'Dedicated success manager',
      'Custom security & compliance',
      'Onboarding and training',
    ],
  },
]

function Pricing() {
  return (
    <MarketingLayout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
          Pricing
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#94a3b8', mb: 6, maxWidth: 640, mx: 'auto', textAlign: 'center' }}
        >
          Simple, transparent pricing that scales with your hiring needs. All plans include our
          core assessment engine and reporting.
        </Typography>

        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.name}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  border: plan.featured
                    ? '1px solid rgba(96,165,250,0.9)'
                    : '1px solid rgba(148,163,184,0.4)',
                  background:
                    'radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 55%)',
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ color: '#60a5fa' }}>
                    {plan.name}
                  </Typography>
                  <div>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {plan.price}
                    </Typography>
                    {plan.cadence && (
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {plan.cadence}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="body2" sx={{ color: '#cbd5f5' }}>
                    {plan.highlight}
                  </Typography>
                  <Stack component="ul" spacing={1} sx={{ listStyle: 'none', pl: 0, mt: 1 }}>
                    {plan.features.map((feature) => (
                      <Typography key={feature} component="li" variant="body2" sx={{ color: '#e2e8f0' }}>
                        • {feature}
                      </Typography>
                    ))}
                  </Stack>
                  <Button
                    variant={plan.featured ? 'contained' : 'outlined'}
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    Talk to sales
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MarketingLayout>
  )
}

export default Pricing

