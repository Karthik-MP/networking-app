module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            'react-native-worklets/plugin',
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@assets': './assets',
                        '@components': './components',
                        '@contexts': './contexts',
                        '@screens': './screens',
                        '@navigations': './navigations',
                        '@hooks': './hooks',
                        '@constants': './constants',
                        '@services': './services',
                    },
                },
            ],
        ],
    };
};