import { Box } from '@mui/material';
import TopNav from './components/TopNav';
import HeroSection from './components/HeroSection';
import StatsStrip from './components/StatsStrip';
import HowItWorks from './components/HowItWorks';
import VerificationOptions from './components/VerificationOptions';
import SkillsGrid from './components/SkillsGrid';
import RecruiterFeatures from './components/RecruiterFeatures';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FooterLanding from './components/FooterLanding';
import ParticlesBackground from './components/ParticlesBackground';

export default function HomePage() {
    return (
        <Box sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: 'text.primary', position: 'relative', overflow: 'hidden' }}>
            <ParticlesBackground />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <TopNav />
                <HeroSection />
                <StatsStrip />
                <HowItWorks />
                <VerificationOptions />
                <SkillsGrid />
                <RecruiterFeatures />
                <Testimonials />
                <FAQ />
                <FooterLanding />
            </Box>
        </Box>
    );
}

