import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { PostList } from '@/components/Post/PostList';

export const revalidate = timeouts.home;

export async function generateMetadata(): Promise<Metadata> {
    return {
        alternates: {
            canonical: '/',
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

const getPageData = cache(async () => {
    const recent = await getRecentBlogPosts(12, true);
    return { recent };
});

export default async function Home() {
    const { recent } = await getPageData();
    return (
        <ContentLayout
            pageType={'home'}
            sidecar={() => (
                <Sidecar
                    pageType="home"
                    includeRecent={false}
                    includeBookarks={true}
                />
            )}
        >
            <PostList posts={recent} />
        </ContentLayout>
    );
}
