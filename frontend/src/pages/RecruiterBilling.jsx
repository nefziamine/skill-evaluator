import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import PaymentMethods from '../components/PaymentMethods';
import TopNav from './MainLanding/components/TopNav';

export default function RecruiterBilling() {
    return (
        <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: 'white' }}>
            <TopNav />
            <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
                <Box sx={{ mb: 4 }}>
                    <Breadcrumbs sx={{ color: 'text.secondary', mb: 2 }}>
                        <MuiLink component={Link} to="/recruiter/dashboard" color="inherit" underline="hover">
                            Dashboard
                        </MuiLink>
                        <Typography color="text.primary">Billing & Payments</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" fontWeight={800}>Billing Settings</Typography>
                </Box>

                <Box sx={{ 
                    bgcolor: 'rgba(30, 41, 59, 0.3)', 
                    borderRadius: 8, 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    p: { xs: 2, md: 4 }
                }}>
                    <PaymentMethods />
                </Box>
            </Container>
        </Box>
    );
}
