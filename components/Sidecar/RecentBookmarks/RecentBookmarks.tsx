import React from 'react';
import Link from 'next/link';
import { getRecentBookmarks } from '@/lib/bookmarks';

export async function RecentBookmarks() {
    const recentBookmarks = await getRecentBookmarks(10);

    return (
        <aside>
            <h2>Around The Web</h2>
            <ul>
                {recentBookmarks.map(p => (
                    <li key={p.id} className="leading-8">
                        <Link href={`${p.url}`} target="_blank">
                            {p.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
