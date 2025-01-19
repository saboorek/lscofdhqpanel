const configs = {
    development: {
        CLIENT_URL: 'http://localhost:5173',
        API_URL: 'http://localhost:5000',
    },
    production: {
        CLIENT_URL: 'http://lscofd.sbrkcode.pl',
        API_URL: 'https://api.lscofd.sbrkcode.pl',
    },
};

const getConfig = (hostname) => {
    if (hostname.includes('localhost')) {
        return configs.development;
    }
    return configs.production;
};

module.exports = getConfig;