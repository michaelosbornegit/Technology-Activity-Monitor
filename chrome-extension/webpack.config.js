const path = require("path");

module.exports = {
        // the main solution
    entry: "./src/background.js", // your entry file that you want it to be bundled for production
    output: { // the output file path,
        path: path.resolve(__dirname, "build"), // build is your folder name.
        filename: "background.js", // your specific filename to be built in the build folder.
    }, };