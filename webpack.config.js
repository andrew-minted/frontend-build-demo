// Copyright (C) 2015 Minted Inc.
// All Rights Reserved

'use strict';

module.exports = {
  //enable sourcemaps
  devtool: 'eval-source-map',
  // watch source files (via entry) for changes and rebundle automatically
  watch: true,
  // start with the address book main file, which requires all libs
  entry: './src/app.jsx',
  output: {
    path: './build',
    // this will be the final bundle requested in our html
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: [
      // this is where require(..) statements look for modules
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx']  // any are valid extensions
  },
  module: {
    loaders: [
      // allow loading jsx with es6 and js with es6
      {include: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  plugins: []
};
