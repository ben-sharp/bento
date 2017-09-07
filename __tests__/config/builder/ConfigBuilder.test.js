const ConfigBuilder = require("../../../config/builder");

describe("ConfigBuilder", () => {
    describe(".use()", () => {
        it("works as expected in non-async mode", () => {
            const root = process.cwd();
            ConfigBuilder.create({
                paths: {
                    root,
                    input: "./foo",
                    output: "./baz"
                }
            })
                .use([
                    function(config, options) {
                        options.set("foo", "baz");
                    }
                ])
                .build((config, options) => {
                    expect(options.get("foo")).toEqual("baz");
                });
        });

        it("works as expected in async mode", done => {
            const root = process.cwd();
            ConfigBuilder.create({
                paths: {
                    root,
                    input: "@{paths.root}/foo",
                    output: "@{paths.root}/baz"
                }
            })
                .use([
                    function(config, options) {
                        options.set("foo", "baz");
                        return new Promise(resolve => {
                            setTimeout(resolve, 100);
                        });
                    }
                ])
                .build((config, options) => {
                    expect(options.get("foo")).toEqual("baz");
                    done();
                });
        });
    });

    describe(".build()", () => {
        it("works as expected", () => {
            const root = process.cwd();
            ConfigBuilder.create({
                paths: {
                    root,
                    input: "./foo",
                    output: "./baz"
                }
            })
                .build((config, options) => {
                    const { input, output } = options.get("paths");

                    expect(input).toEqual(`${root}/foo`);
                    expect(output).toEqual(`${root}/baz`);

                    config.merge({
                        foo: "baz"
                    });
                })
                .then(config => {
                    expect(config.foo).toEqual("baz");
                });
        });
    });
});