import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
            },
        },
    },
    plugins: [],
} satisfies Config