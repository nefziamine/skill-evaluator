import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import api from '../services/api'

function InviteHandler() {
    const { token } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const testId = searchParams.get('testId')

    useEffect(() => {
        const handleInviteToken = async () => {
            if (token) {
                // Clear any existing session (log out) to prevent role conflicts
                // If a recruiter clicks an invite link, we want them to see the candidate flow.
                localStorage.removeItem('token')
                localStorage.removeItem('userRole')
                
                // For new candidates or cleared sessions, proceed with invite token
                localStorage.setItem('token', token)
                localStorage.setItem('userRole', 'CANDIDATE')

                try {
                    // Check if candidate needs to set up password
                    const response = await api.get('/auth/me')
                    const user = response.data
                    
                    // Check if password is still the default "invited" (backend will handle this check)
                    // For now, redirect to password setup page for all candidates
                    navigate(`/candidate/setup?token=${token}${testId ? `&testId=${testId}` : ''}`)
                } catch (error) {
                    // If we can't validate the user, still proceed to setup
                    navigate(`/candidate/setup?token=${token}${testId ? `&testId=${testId}` : ''}`)
                }
            }
        }
        
        handleInviteToken()
    }, [token, testId, navigate])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#020617' }}>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6" color="white">Preparing your assessment...</Typography>
        </Box>
    )
}

export default InviteHandler
