import React, { cache } from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';

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
    const recent = await getRecentBlogPosts(3, true);
    const engineering = await getRecentBlogPosts(3, true, [
        'Engineering',
        'Tools',
        'Libraries',
    ]);
    const thinking = await getRecentBlogPosts(3, true, [
        'Organization',
        'People',
        'Planning',
    ]);
    return { recent, engineering, thinking };
});

export default async function Home() {
    const { recent, engineering, thinking } = await getPageData();
    return (
        <ContentLayout
            pageType={'home'}
            sidecar={() => <Sidecar pageType="home" />}
        >
            <div className="mb-5">
                <ThreeUpPosts posts={recent} title="Recent" />
            </div>

            <div className="mb-5">
                <ThreeUpPosts
                    posts={engineering}
                    title="Tooling and Libraries"
                />
            </div>

            <ThreeUpPosts
                posts={thinking}
                title="People and Planning"
            />
        </ContentLayout>
    );
}
