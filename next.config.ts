const nextConfig = {
    webpack: (config: any, { isServer }: { isServer: boolean }) => {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: [
                '**/node_modules/**',
                '**/.git/**',
                '**/.next/**',
                '**/Application Data/**',
                '**/AppData/**',
                '**/System Volume Information/**',
                '**/$RECYCLE.BIN/**',
            ],
        };

        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve?.fallback,
                fs: false,
                path: false,
                os: false,
            },
        };

        return config;
    },
    trailingSlash: false,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "*.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "github-production-user-asset-6210df.s3.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;