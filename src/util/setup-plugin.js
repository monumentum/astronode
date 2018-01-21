exports.getName = name => {
    let closureChain = name.split(":");
    const config = { name: closureChain[0] };

    closureChain = closureChain.map(c => c.split(","));
    closureChain.shift();

    if (closureChain.length > 0) {
        config.chain = closureChain;
    }

    return config;
}

exports.invokeFunction = (fn, chain) => {
    chain.forEach(parameters => {
        fn = fn.apply(null, parameters);
    });

    return fn;
}