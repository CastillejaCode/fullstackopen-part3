module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['plugin:react/recommended', 'airbnb'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['react'],
	rules: {
		'no-tabs': 0,
		indent: 0,
		'no-unused-vars': 0,
	},
};
