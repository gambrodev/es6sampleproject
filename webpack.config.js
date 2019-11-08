const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // search the modules in this file
    entry: [
        './src/js/index.js',
        'babel-polyfill'    
        // code needed by babel to
        // write to ES5 things like Promises
        // which aren't ES5 native
       
    ],
    // output in this path and this filename (__dirname is current dir)
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    //config per webpack-dev-server
    devServer: {
        // where to look for content
        contentBase: './dist'
    },
    plugins: [
        // index.html will be copyied in ./dist
        new htmlWebpackPlugin({
            // name of the output file
            filename: 'index.html',
            // source
            template: './src/index.html'
        })
    ], 
    // convert js to be readable by browsers
    module: {
        rules: [
            {
                // regexp to target all .js files
                test: /\.js$/,
                // regexp to excule node_modules dir
                exclude: /node_modules/,
                // use the babel loader specified in package.json
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
    // non altera il codice come se fosse produzione per essere più veloce
    //mode: 'development' -- spostato in package.json npm script

};