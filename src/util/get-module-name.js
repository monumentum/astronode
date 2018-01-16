module.exports = (path, root) => {
    const barRxp = '[\\|\\/]';
    const rootRxp = root + barRxp;
    const foundRxp = rootRxp + '.*' + barRxp;

    const rxp = new RegExp(foundRxp, 'g');
    const match = path.match(rxp);

    return !!match &&
                match[0].replace(new RegExp(root, 'g'), '')
                    .replace(new RegExp(barRxp, 'g'), '');
};
