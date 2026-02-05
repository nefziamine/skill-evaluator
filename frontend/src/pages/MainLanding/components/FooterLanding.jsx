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
                            <Link href="#" color="text.secondary">
                                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, fill: 'currentColor' }}>
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
                                </svg>
                            </Link>
                            <Link href="#" color="text.secondary"><LinkedIn /></Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Platform</Typography>
                        <Stack spacing={1}>
                            <Link href="/tests" color="text.secondary" underline="hover">Tests</Link>
                            <Link href="/how-it-works" color="text.secondary" underline="hover">How it Works</Link>
                            <Link href="#" color="text.secondary" underline="hover">AI Advanced</Link>
                            <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>For Recruiters</Typography>
                        <Stack spacing={1}>
                            <Link href="/talent" color="text.secondary" underline="hover">Browse Talent</Link>
                            <Link href="/post-job" color="text.secondary" underline="hover">Post a Job</Link>
                            <Link href="/enterprise" color="text.secondary" underline="hover">Enterprise</Link>
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

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Skill Evaluator. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
