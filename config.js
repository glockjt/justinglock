var config = {};

// config.port = 1684;
config.name = 'Justin Glock';
config.description = "Justin Glock's personal blog with insight on hockey and the Pittsburgh Penguins.";
config.url = 'www.justinglock.com';
config.baseUrl = 'http://' + config.url;
config.categories = ['Penguins', 'Hockey', 'Pittsburgh', 'Sports', 'Pittsburgh Penguins'];
// config.port = 3000;

config.mail = {
    host: // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: // username,
        pass: // password
    }
};

config.users = {
    admin: [
    {
        id: 1,
        username: // username
        twitterId: // twitter id
        password: // hashed password
    }
    ]
};

config.twitter = {
    key: // twitter key,
    secret: // twitter secret,
    access_token: // token,
    access_token_secret: //token secret
};

config.openshift = {
    ip: process.env.OPENSHIFT_NODEJS_IP,
    port: process.env.OPENSHIFT_NODEJS_PORT,
    mongo: {
        username: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
        password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
        host: process.env.OPENSHIFT_MONGODB_DB_HOST,
        port: process.env.OPENSHIFT_MONGODB_DB_PORT,
        app: process.env.OPENSHIFT_APP_NAME
    }

}

module.exports = config;