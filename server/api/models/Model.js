var {Pool, Client } = require('pg');

var client = new Client("postgres://exynoisk:G3S3wKJRB3tCZmxFSuUHH1gzjt-AUq0x@manny.db.elephantsql.com:5432/exynoisk");

client.connect();

module.exports = client;