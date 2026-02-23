import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { LockOutlined, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function UnlockOverlay({ message = "Sign in to unlock full access", submessage = "Experience the full power of our AI-driven talent platform." }) {
    const theme = useTheme();

    return (
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            bgcolor: alpha('#0f172a', 0.6),
            borderRadius: 'inherit',
            textAlign: 'center',
            p: 4
        }}>
            <Box sx={{
                maxWidth: 450,
                bgcolor: alpha('#1e293b', 0.8),
                p: 6,
                borderRadius: 8,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                animation: 'fadeInUp 0.6s ease-out'
            }}>
                <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2)
                }}>
                    <LockOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>

                <Typography variant="h4" fontWeight={900} gutterBottom sx={{ mb: 2 }}>
                    {message}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.1rem' }}>
                    {submessage}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            py: 2,
                            borderRadius: 4,
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}
                    >
                        Create Free Account
                    </Button>
                    <Button
                        component={Link}
                        to="/login"
                        variant="text"
                        fullWidth
                        sx={{ color: 'white', fontWeight: 600 }}
                    >
                        Already have an account? Log in
                    </Button>
                </Box>
            </Box>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Box>
    );
}
