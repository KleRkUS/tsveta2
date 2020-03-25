module.exports = {
  entry: {
    index: ['@babel/polyfill', "./src/index.js"],
  },
  output: {
    path: __dirname + "/public/assets/",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};