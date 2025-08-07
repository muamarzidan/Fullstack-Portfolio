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
    // experimental: {
    //     forceSwcTransforms: true,
    // },
};

export default nextConfig;