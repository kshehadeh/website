/** @type {import('next').NextConfig} */
const nextConfig = {
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
        ],
    },
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;
