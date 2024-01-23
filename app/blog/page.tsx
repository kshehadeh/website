import React from 'react';
import '../globals.css';
import { getRecentBlogPosts } from '@/lib/blog';
import { Post, PostList } from '@/components/Post/Post';

export default async function MainBlogPage() {
    // Get the list the last X posts from Notion
    const posts = await getRecentBlogPosts(10, true)
    return (
        <PostList>
            {posts.map(post => {
                return (
                    <Post key={`post-${post.slug}`} post={post}/>
                );
            })}
        </PostList>
    );
}
