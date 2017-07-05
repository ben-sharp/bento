const { config, select, read } = require("../utils"),
    path = require("path");

module.exports = config(instance => {
    return instance.merge({
        context: read("paths.resolved.input"),
        entry: read("entry"),

        devtool: select({
            development: "cheap-module-eval-source-map",
            production: read("enabled.sourceMap") ? "source-map" : undefined
        }),

        output: {
            path: read("paths.resolved.output"),
            publicPath: read("paths.public"),
            filename: `scripts/${read("filename").replace(
                "hash",
                "chunkhash"
            )}.js`
        },

        resolve: {
            extensions: ["*", ".js"],
            alias: {
                "~": path.join(read("paths.resolved.input"), "scripts")
            }
        }
    });
});
