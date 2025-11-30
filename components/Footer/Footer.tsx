import React from 'react';
import PersonalReferencesList from '../About/References';
import { getAboutPage, getPersonalReferences } from '@/lib/about';

export async function Footer() {
    const page = await getAboutPage();
    const references = page ? await getPersonalReferences(page) : [];

    return (
        <footer className="bg-card border-t border-border text-card-foreground text-center p-5 flex flex-row justify-between fixed bottom-0 w-[100%]">
            <div className="text-muted-foreground">
                &copy; {new Date().getFullYear()} Karim Shehadeh
            </div>
            <PersonalReferencesList references={references} />
        </footer>
    );
}
