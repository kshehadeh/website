import React from 'react';
import PersonalReferencesList from '../About/References';
import { getFooterReferences } from '@/lib/about';

export async function Footer() {
    const references = await getFooterReferences();

    return (
        <footer className="bg-card border-t border-border text-card-foreground text-center p-5 flex flex-row justify-between fixed bottom-0 w-[100%]">
            <div className="text-muted-foreground">&copy; Karim Shehadeh</div>
            <PersonalReferencesList references={references} />
        </footer>
    );
}
