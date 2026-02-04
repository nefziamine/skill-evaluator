import { Box, Container, Typography, Grid, Link, Stack, Divider } from '@mui/material';
import { LinkedIn, Twitter, GitHub, VerifiedUser } from '@mui/icons-material';

export default function FooterLanding() {
    return (
        <Box sx={{ bgcolor: 'background.paper', py: 8, borderTop: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg">
                <Grid container spacing={8}>
                    <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <VerifiedUser color="primary" />
                            <Typography variant="h6" fontWeight={800}>Skill Evaluator</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                            The open standard for developer skill verification. bridging the gap between talent and opportunity with AI-powered assessments.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Link href="#" color="text.secondary"><GitHub /></Link>
                            <Link href="#" color="text.secondary"><Twitter /></Link>
                            <Link href="#" color="text.secondary"><LinkedIn /></Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Platform</Typography>
                        <Stack spacing={1}>
                            <Link href="/tests" color="text.secondary" underline="hover">Tests</Link>
                            <Link href="#" color="text.secondary" underline="hover">AI Advanced</Link>
                            <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>For Recruiters</Typography>
                        <Stack spacing={1}>
                            <Link href="/talent" color="text.secondary" underline="hover">Browse Talent</Link>
                            <Link href="#" color="text.secondary" underline="hover">Post a Job</Link>
                            <Link href="#" color="text.secondary" underline="hover">Enterprise</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Company</Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover">About</Link>
                            <Link href="#" color="text.secondary" underline="hover">Careers</Link>
                            <Link href="#" color="text.secondary" underline="hover">Contact</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Legal</Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover">Terms</Link>
                            <Link href="#" color="text.secondary" underline="hover">Privacy</Link>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Skill Evaluator. All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: { xs: 2, sm: 0 } }}>
                        Verification supports recruitment decisions; final hiring decisions remain the responsibility of employers.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
