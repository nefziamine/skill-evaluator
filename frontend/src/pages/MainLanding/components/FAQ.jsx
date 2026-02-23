import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const faqs = [
    { q: "Are standard tests free?", a: "Yes. Standard skill tests are 100% free for developers. You can take them to verify your skills and get a badge on your profile." },
    { q: "What is AI Advanced verification?", a: "AI Advanced is a premium assessment that dynamically generates scenarios and adapts deeper into the topic, awarding a prestigious 'AI Verified' badge upon completion." },
    { q: "Do recruiters pay?", a: "Recruiters can browse basics for free but premium search filters and accessing full candidate reports requires a subscription." },
    { q: "Can I retake tests?", a: "Yes, you can retake a standard test after a cooldown period of 30 days to improve your score." },
    { q: "How do badges work?", a: "Badges are automatically added to your profile once you pass a proctored or unproctored assessment with a passing score." },
];

export default function FAQ() {
    return (
        <Box sx={{ py: 12, bgcolor: '#1e293b' }}>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" fontWeight={800} sx={{ mb: 6 }}>Frequently Asked Questions</Typography>
                <Box>
                    {faqs.map((f, i) => (
                        <Accordion key={i} sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <AccordionSummary expandIcon={<ExpandMore color="primary" />} sx={{ px: 0 }}>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.1rem' }}>{f.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pb: 3 }}>
                                <Typography color="text.secondary">{f.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
