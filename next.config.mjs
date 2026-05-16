/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheComponents: true,
    turbopack: {
        resolveAlias: {
            canvas: './empty-module.ts',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.karim.cloud',
            },
            {
                protocol: 'https',
                hostname: 's3-us-west-2.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'devdash.iwonderdesigns.com',
                pathname: '/img/**',
            },
        ],
    },
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;
