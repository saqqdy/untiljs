module.exports = {
	presets: [
		[
			'@babel/env',
			{
				exclude: ['transform-regenerator'],
				targets: {
					// node: '12.20',
					browsers: [
						'> 1%',
						'last 2 versions',
						'not ie < 11',
						'not ie_mob < 11',
						'not op_mini all',
					],
				},
			},
		],
		'@babel/typescript',
	],
}
