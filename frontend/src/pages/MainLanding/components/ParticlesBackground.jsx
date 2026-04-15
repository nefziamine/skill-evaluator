import React, { useEffect, useMemo, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Box } from "@mui/material";

const ParticlesBackground = memo(function ParticlesBackground() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setReady(true);
        });
    }, []);

    const options = useMemo(
        () => ({
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "bubble",
                    },
                    resize: true,
                },
                modes: {
                    bubble: {
                        distance: 400,
                        duration: 2,
                        opacity: 0.8,
                        size: 40,
                    },
                    push: {
                        quantity: 4,
                    },
                },
            },
            particles: {
                color: {
                    value: ["#3b82f6", "#60a5fa", "#a78bfa", "#ec4899"],
                },
                links: {
                    enable: false,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: true,
                    speed: { min: 1, max: 3 },
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 40, // Fewer but larger bubbles
                },
                opacity: {
                    value: { min: 0.1, max: 0.3 },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 5, max: 15 }, // Larger circles like bubbles
                },
            },
            detectRetina: true,
        }),
        []
    );

    if (!ready) return null;

    return (
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            <Particles
                id="tsparticles"
                options={options}
                className="particles-background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
            />
        </Box>
    );
});

export default ParticlesBackground;
