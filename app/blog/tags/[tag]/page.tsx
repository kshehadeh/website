import React from 'react';
import '../globals.css';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostBrief, PostList } from '@/components/Post/PostBrief';

export default async function MainBlogPage() {
    // Get the list the last X posts from Notion
    const posts = await getRecentBlogPosts(10, true)
    return (
        <PostList>
            {posts.map(post => {
                return (
                    <PostBrief key={`post-${post.id}`} post={post}/>
                );
            })}
        </PostList>
    );
}
