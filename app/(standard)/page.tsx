import React, { cache } from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.home;

export async function generateMetadata() {
    return {
        alternates: {
            canonical: '/',
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
            <h1>Karim&apos;s Blog and Other Ramblings</h1>
            <div className="mb-5">
                <ThreeUpPosts posts={recent} title="Recent" />
            </div>

            <div className="mb-5">
                <ThreeUpPosts
                    posts={engineering}
                    title="Engineering, Tooling and Libraries"
                />
            </div>

            <ThreeUpPosts
                posts={thinking}
                title="Organization, People and Planning"
            />
        </ContentLayout>
    );
}
