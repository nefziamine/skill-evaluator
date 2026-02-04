import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
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
            fullScreen: { enable: true, zIndex: 50 },
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                    resize: true,
                },
                modes: {
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                        factor: 100,
                        speed: 1,
                        maxSpeed: 50,
                    },
                },
            },
            particles: {
                color: {
                    value: ["#3b82f6", "#60a5fa", "#a78bfa"],
                },
                links: {
                    enable: false, // Google Antigravity style (no links)
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: true,
                    speed: 1.5,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 120,
                },
                opacity: {
                    value: { min: 0.3, max: 0.8 },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 4 },
                },
            },
            detectRetina: true,
        }),
        []
    );

    if (!ready) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="particles-background"
        />
    );
}
