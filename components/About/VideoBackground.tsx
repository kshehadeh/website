'use client';

import { useEffect, useRef, useState } from 'react';

export function VideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        // Set slow motion playback rate and ensure video plays
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5; // Half speed for slow motion
            videoRef.current.play().catch(() => {
                // Ignore autoplay errors
            });
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            setMousePosition({ x, y });
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, []);

    // Calculate video position based on mouse position
    // The video will shift slightly based on mouse position for a parallax effect
    const translateX = (mousePosition.x - 0.5) * 8; // Max 4% shift
    const translateY = (mousePosition.y - 0.5) * 8; // Max 4% shift
    const scale = 1.15; // Slightly zoomed to allow for movement

    return (
        <div
            ref={containerRef}
            className="fixed cover-image top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
        >
            <div className="absolute inset-0 bg-background/50 z-10" />
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-10 transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`,
                }}
            >
                <source src="/me-video.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
