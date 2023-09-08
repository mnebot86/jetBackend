module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'jest': true,
	},
	'plugins': ['jest'],
	'extends': 'eslint:recommended',
	'overrides': [
		{
			'env': {
				'node': true,
			},
			'files': [
				'.eslintrc.{js,cjs}',
			],
			'parserOptions': {
				'sourceType': 'script',
			},
		},
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'globals': {
		process: true,
	},
	'rules': {
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'arrow-parens': ['error', 'as-needed'],
		'space-before-function-paren': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'no-mixed-spaces-and-tabs': 'error',
		'lines-between-class-members': ['error', 'always'],
		'no-multiple-empty-lines': ['error', { 'max': 1 }],
		'no-multi-spaces': 'error',
		'key-spacing': ['error', { 'mode': 'strict' }],
		'comma-dangle': ['error', { 'arrays': 'always-multiline', 'objects': 'always-multiline', 'functions': 'only-multiline', 'imports': 'always-multiline' }],
		'padding-line-between-statements': [
			'error',
			{ 'blankLine': 'always', 'prev': '*', 'next': 'return' },
			{ 'blankLine': 'always', 'prev': '*', 'next': 'break' },
			{ 'blankLine': 'always', 'prev': '*', 'next': 'block-like' },
		],
		'no-unused-vars': 'warn',
	},
};
