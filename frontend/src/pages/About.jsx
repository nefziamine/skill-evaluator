import { Container, Typography, Stack } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

function About() {
  return (
    <MarketingLayout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
          About Skill Evaluator
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8 }}>
          Skill Evaluator is an AI-powered assessment platform built to give hiring teams a
          reliable signal on real-world developer skills. We combine adaptive testing,
          realistic coding scenarios, and detailed insights so you can move from guesswork
          to evidence-based hiring.
        </Typography>
        <Stack spacing={3}>
          <div>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Our mission
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              We want every developer to be evaluated on what they can actually build, not just
              on their resume or where they studied. Our platform helps companies of all sizes
              run fair, repeatable, and scalable technical evaluations.
            </Typography>
          </div>
          <div>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Why we built this
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8 }}>
              Traditional hiring processes are noisy and slow. By standardising skill signals
              and surfacing the right insights, Skill Evaluator lets teams focus their time on
              the best-fitting candidates.
            </Typography>
          </div>
        </Stack>
      </Container>
    </MarketingLayout>
  )
}

export default About

