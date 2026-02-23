
export default [
    {
        files: ["**/*.jsx", "**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            // Minimal rules to check for syntax
        }
    }
];
