/** @type {import('next').NextConfig} */
const nextConfig = {
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
