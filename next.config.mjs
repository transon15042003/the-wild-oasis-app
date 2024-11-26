/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qsmwnmhfoijnnmbyjvcn.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/cabin_images/**',
            },
        ],
    },
    // output: 'export',
};

export default nextConfig;
