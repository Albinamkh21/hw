var fs = require('fs');

module.exports = {
    readFile: function(fileName, encoding) {
        return new Promise(function(resolve, reject) {
            fs.readFile(fileName, encoding, function(error, content) {
                if (error) {
                    reject(error);
                } else {
                    resolve(content)
                }
            });
        });
    },
    readPlacemark: function(req) {
        var postBody = '';

        return new Promise(function(resolve, reject) {
            req.on('data', function(chunk) {
                postBody += chunk;
            });

            req.on('end', function() {
                resolve(JSON.parse(postBody));
            });

            req.on('error', function() {
                reject();
            });
        });
    }
};
