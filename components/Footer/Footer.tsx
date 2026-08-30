import React from 'react';
import Link from 'next/link';
import PersonalReferencesList from '../About/References';
import { getFooterReferences } from '@/lib/about';

export async function Footer() {
    const references = await getFooterReferences();

    return (
        <footer className="bg-card border-t border-border text-card-foreground text-center p-5 flex flex-row justify-between w-full">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <span>&copy; Karim Shehadeh</span>
                <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                >
                    Terms &amp; Conditions
                </Link>
            </div>
            <PersonalReferencesList references={references} />
        </footer>
    );
}
