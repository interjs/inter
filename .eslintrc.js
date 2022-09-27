module.exports = {
	
	env: {
		browser: true,
		es6: true,
	},
	extends: "eslint:recommended",
	rules: {
		
		"quotes": ["warn", "double"],
		"no-var": "error",
		"no-alert": "error",
		"no-console" : "error",
		"camelcase": "error",
		"prefer-const": "warn",
		"prefer-template": "error",
		"getter-return": "error",
		
	
		},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"

	}
	
};


