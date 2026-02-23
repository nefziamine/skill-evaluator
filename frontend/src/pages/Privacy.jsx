import { Container, Typography, Stack } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

function Privacy() {
  return (
    <MarketingLayout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8 }}>
          This Privacy Policy explains how Skill Evaluator collects, uses, and protects personal
          data for both hiring teams and candidates using the platform.
        </Typography>

        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Data we collect
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              We collect account details, usage data, assessment responses, and technical
              telemetry to secure and improve the service. Candidate code submissions are stored
              so that recruiters can review and compare skill signals over time.
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              How we use data
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              Data is used to run assessments, generate results, improve the product, and provide
              support. We do not sell personal data and only share it with trusted processors as
              needed to deliver the service.
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Your choices
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              Depending on your region, you may request access, correction, or deletion of your
              personal data. Contact us if you would like to exercise these rights.
            </Typography>
          </div>
        </Stack>
      </Container>
    </MarketingLayout>
  )
}

export default Privacy

