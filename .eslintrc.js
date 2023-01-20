module.exports = {
	
	env: {
		browser: true,
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
		"getter-return": "error",
		"no-inner-declarations": "off"
	
		},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"

	}
	
};
