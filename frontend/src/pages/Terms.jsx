import { Container, Typography, Stack } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

function Terms() {
  return (
    <MarketingLayout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
          Terms of Service
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8 }}>
          These Terms govern your access to and use of the Skill Evaluator platform. By creating
          an account or running assessments, you agree to be bound by these Terms.
        </Typography>

        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              1. Use of the platform
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              You may use Skill Evaluator only for lawful hiring and evaluation purposes and in
              accordance with all applicable laws, including data protection and employment
              regulations in the regions where you operate.
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              2. Candidate data
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              You are responsible for obtaining any required consents from candidates and for how
              you use assessment results in your hiring processes.
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              3. Service availability
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              We aim for high availability but do not guarantee that the platform will be
              uninterrupted or error‑free. We may update or change the service from time to time.
            </Typography>
          </div>
        </Stack>
      </Container>
    </MarketingLayout>
  )
}

export default Terms

