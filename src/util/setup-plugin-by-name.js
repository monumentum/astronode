module.exports = name => {
    let closureChain = name.split(":");
    const config = { name: closureChain[0] };

    closureChain = closureChain.map(c => c.split(","));
    closureChain.shift();

    if (closureChain.length > 0) {
        config.chain = closureChain;
    }

    return config;
}