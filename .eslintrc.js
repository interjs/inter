module.exports = {
	
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	extends: "eslint:recommended",
	rules: {
		
		"quotes": ["warn", "double"],
		"no-var": "error",
		"no-alert": "error",
		"camelcase": "error",
		"prefer-const": "warn",
		"prefer-template": "error",
		"getter-return": "error"
	
		},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"

	},	
	root: true,
	
};


