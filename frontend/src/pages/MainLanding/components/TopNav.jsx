import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme, useScrollTrigger } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { VerifiedUser } from '@mui/icons-material';

function ScrollElevation({ children }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        sx: {
            backgroundColor: trigger ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            borderBottom: trigger ? 1 : 0,
            borderColor: 'rgba(255,255,255,0.05)'
        }
    });
}

export default function TopNav() {
    const theme = useTheme();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    return (
        <ScrollElevation>
            <AppBar position="fixed" color="transparent" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ height: 80 }}>
                        {/* Logo */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                flexGrow: 1
                            }}
                        >
                            <VerifiedUser sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                                Skill Evaluator
                            </Typography>
                        </Box>

                        {/* Desktop Links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center', mr: 4 }}>
                            {['Tests', 'AI Advanced', 'For Recruiters', 'How it works'].map((text) => (
                                <Button
                                    key={text}
                                    component={Link}
                                    to={text === 'Tests' ? '/tests' : '#'}
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
                                    }}
                                >
                                    {text}
                                </Button>
                            ))}
                        </Box>

                        {/* Auth Buttons */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            {isLoggedIn ? (
                                <Button
                                    component={Link}
                                    to={role === 'ADMIN' ? '/admin/dashboard' : '/recruiter/dashboard'}
                                    variant="contained"
                                    sx={{ borderRadius: 50, px: 3, fontWeight: 700 }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="text"
                                        sx={{ fontWeight: 600, color: 'text.primary', textTransform: 'none' }}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        sx={{
                                            borderRadius: 50,
                                            px: 3,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}80`
                                        }}
                                    >
                                        Sign up
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ScrollElevation>
    );
}
