/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
            resolveAlias: {
                canvas: './empty-module.ts',
            },
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.karim.cloud',
            },
        ],
    },
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;
