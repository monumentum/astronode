module.exports = path => {
    return path.split(/(\/|\\)/)
                .reverse()[0]
                .replace(/\..*/, "")
}
