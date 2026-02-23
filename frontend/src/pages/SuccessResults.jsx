import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    CircularProgress,
    Grid,
    alpha,
    useTheme,
} from '@mui/material'
import { EmojiEvents, BarChart, AssignmentTurnedIn } from '@mui/icons-material'
import Layout from '../components/Layout'
import api from '../services/api'

function SuccessResults() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const theme = useTheme()
    const [result, setResult] = useState(null)
    const [rank, setRank] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [sessionId])

    const fetchData = async () => {
        try {
            const [resultRes, rankRes] = await Promise.all([
                api.get(`/candidate/sessions/${sessionId}/result`),
                api.get(`/candidate/sessions/${sessionId}/rank`)
            ])
            setResult(resultRes.data)
            setRank(rankRes.data)
        } catch (err) {
            console.error('Failed to load results', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <Container sx={{ mt: 10, textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography sx={{ mt: 2 }}>Analyzing your performance...</Typography>
                </Container>
            </Layout>
        )
    }

    return (
        <Layout>
            <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        borderRadius: 8,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid',
                        borderColor: alpha('#fff', 0.05),
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Glow */}
                    <Box sx={{
                        position: 'absolute',
                        top: '-20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '300px',
                        height: '300px',
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        zIndex: 0
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <EmojiEvents sx={{ fontSize: 80, color: '#fbbf24', mb: 2 }} />
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Assessment Complete!</Typography>
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 6 }}>
                            Great job on completing the <strong>{result?.testTitle}</strong> assessment.
                        </Typography>

                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                                        {result?.score}/{result?.totalPoints}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Final Score</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {rank?.rank} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ {rank?.totalCandidates}</span>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Global Rank</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRadius: 4, border: '1px solid', borderColor: alpha('#fff', 0.05) }}>
                                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>
                                        Top {100 - (rank?.percentile || 0)}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Percentile</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {rank?.percentile > 80 && (
                            <Box sx={{ mb: 6, p: 3, bgcolor: alpha('#10b981', 0.05), borderRadius: 4, border: '1px solid', borderColor: alpha('#10b981', 0.1) }}>
                                <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 700 }}>🌟 Outstanding Performance!</Typography>
                                <Typography variant="body2" color="textSecondary">Your score is significantly higher than the average candidate.</Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/')}
                                sx={{ px: 6, py: 2, borderRadius: 3, fontWeight: 700 }}
                            >
                                Back to Home
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Layout>
    )
}

export default SuccessResults
