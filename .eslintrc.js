module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"]
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "@ryan-rushton/eslint-config",
        "@ryan-rushton/eslint-config/react-prettier",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        "react/prop-types": "off",
        "@typescript-eslint/typedef": [
            "error",
            {
                arrowParameter: true,
                memberVariableDeclaration: true,
                parameter: true,
                propertyDeclaration: true
            }
        ]
    }
};
