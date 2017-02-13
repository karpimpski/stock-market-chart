const webpack = require('webpack');

module.exports = {
	entry: './components/index.js',
	output: {
		filename: './public/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
			}
		]
	},
	plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      output: {
        comments: false
      } 
    })
  ]
}