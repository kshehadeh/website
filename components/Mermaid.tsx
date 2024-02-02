"use client";
import React from "react";

import mermaid from "mermaid";
import { useEffect } from "react";

mermaid.initialize({
    startOnLoad: true,
    theme: "forest",
});

export function Mermaid({ children }: React.PropsWithChildren) {
    useEffect(() => {
        mermaid.contentLoaded();
    })

    return (
        <pre className="mermaid">{children}</pre>
    );
}