import { Container, Typography, TextField, Button, Stack } from '@mui/material'
import MarketingLayout from '../components/MarketingLayout'

function Contact() {
  return (
    <MarketingLayout>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Contact us
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
          Have questions about the platform, pricing, or a specific use case? Drop us a message
          and we&apos;ll get back within one business day.
        </Typography>

        <Stack component="form" spacing={2}>
          <TextField
            label="Work email"
            type="email"
            fullWidth
            required
            variant="outlined"
            sx={{ '& .MuiInputBase-root': { bgcolor: '#020617' } }}
          />
          <TextField
            label="Company"
            fullWidth
            variant="outlined"
            sx={{ '& .MuiInputBase-root': { bgcolor: '#020617' } }}
          />
          <TextField
            label="How can we help?"
            fullWidth
            required
            multiline
            minRows={4}
            variant="outlined"
            sx={{ '& .MuiInputBase-root': { bgcolor: '#020617' } }}
          />
          <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
            Send message
          </Button>
        </Stack>
      </Container>
    </MarketingLayout>
  )
}

export default Contact

