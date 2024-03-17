import { Bookmark } from '@/lib/bookmarks';
import Link from 'next/link';
import React from 'react';
import { TagList } from '../TagList/TagList';

export function BookmarksList({ bookmarks }: { bookmarks: Bookmark[] }) {
    return (
        <ul className="list-none">
            {bookmarks.map(bookmark => (
                <li key={bookmark.id} className={`mt-3`}>
                    <Link
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-600 hover:text-purple-60 font-bold text-lg`}
                    >
                        {bookmark.title}
                    </Link>
                    <p className={`text-sm`}>{bookmark.abstract}</p>
                    <div className="mt-2">
                        <TagList tags={bookmark.tags} type="bookmarks" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
