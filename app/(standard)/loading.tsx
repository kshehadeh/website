'use client';

import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
            {/* Animated geometric background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Rotating circles */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-primary/20 rounded-full animate-[spin_8s_linear_infinite]">
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-primary/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-2 border-primary/15 rounded-full animate-[spin_10s_linear_infinite_reverse]">
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-primary/25 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-12 gap-4 h-full w-full">
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div
                                key={i}
                                className="border border-border/30 animate-pulse"
                                style={{
                                    animationDelay: `${(i % 12) * 0.1}s`,
                                    animationDuration: '2s',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating geometric shapes */}
                <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-accent/30 rotate-45 animate-float"></div>
                <div
                    className="absolute bottom-1/3 left-1/3 w-16 h-16 border-2 border-accent/25 rotate-12 animate-float"
                    style={{ animationDelay: '1s', animationDuration: '4s' }}
                ></div>
                <div
                    className="absolute top-1/2 right-1/2 w-12 h-12 border-2 border-primary/20 rotate-45 animate-float"
                    style={{ animationDelay: '2s', animationDuration: '5s' }}
                ></div>

                {/* Hexagon pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                    <div
                        className="w-full h-full border-2 border-muted-foreground/20 rotate-12 animate-pulse"
                        style={{
                            clipPath:
                                'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                        }}
                    ></div>
                </div>
            </div>

            {/* Main loading content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Animated logo/icon */}
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary rounded-lg rotate-45 animate-[spin_8s_linear_infinite]"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-primary/50 rounded-lg rotate-45 animate-[spin_10s_linear_infinite_reverse]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-lg rotate-45 animate-pulse"></div>
                </div>

                {/* Loading text */}
                <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm font-medium">
                        Loading
                    </span>
                    <div className="flex gap-1">
                        <span
                            className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0s' }}
                        ></span>
                        <span
                            className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                            className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                        ></span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-progress"></div>
                </div>
            </div>
        </div>
    );
}
