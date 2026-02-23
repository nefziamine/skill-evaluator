import { Container, Typography, Stack, Paper } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

function Careers() {
  const roles = [
    {
      title: 'Senior Full‑Stack Engineer',
      location: 'Remote • Europe / Americas',
      description:
        'Own major parts of our assessment experience, from test authoring to live candidate sessions.',
    },
    {
      title: 'Product Designer',
      location: 'Remote • Any timezone',
      description:
        'Design intuitive workflows that make complex hiring decisions simple and collaborative.',
    },
    {
      title: 'Customer Success Lead',
      location: 'Remote • EMEA',
      description:
        'Partner with recruiting teams to roll out Skill Evaluator and drive measurable hiring outcomes.',
    },
  ]

  return (
    <MarketingLayout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Careers
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 5, maxWidth: 640 }}>
          Join a small, product-focused team that cares deeply about developer experience and
          fair, evidence-based hiring. We work remote‑first and trust people to own meaningful
          problems end‑to‑end.
        </Typography>

        <Stack spacing={3}>
          {roles.map((role) => (
            <Paper
              key={role.title}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(15,23,42,1), rgba(30,64,175,0.5))',
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.25)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {role.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {role.location}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5, color: '#cbd5f5' }}>
                {role.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </MarketingLayout>
  )
}

export default Careers

