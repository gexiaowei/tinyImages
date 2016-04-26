/**
 * tinyImages.js
 * @author Vivian
 * @version 1.0.0
 * copyright 2014-2016, gandxiaowei@gmail.com all rights reserved.
 */

var fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    tinify = require("tinify"),
    chalk = require("chalk"),
    async = require("async"),
    Q = require("q"),
    mime = require('mime');

var apiKeysPath = '../apikeys.json';
var apiKeys = require(apiKeysPath);

function TinyImages() {
    this.apiKey = '';
    this.apiKeys = apiKeys || [];
    this.files = [];
    this.tinifying = false;
    this.addApiKey = function (apiKey) {
        if (apiKeys.indexOf(apiKey) >= 0) {
            console.log(chalk.red('✘ ') + apiKey + ' already in the api key list');
        } else {
            this.apiKeys.push(apiKey);
            fs.writeFile(apiKeysPath, JSON.stringify(this.apiKeys), (err) => {
                console.log(fs.realpathSync(apiKeysPath));
                if (err) {
                    console.log(chalk.red('✘ ') + apiKey + ' add to TinyImages failed:\r\n' + err.message);
                } else {
                    console.log(chalk.green('✔ ') + apiKey + ' add to TinyImages Success');
                }
            });
        }
    };

    this.findValidateApiKey = function () {
        var deferred = Q.defer();
        var index = 0;
        if (this.apiKey) {
            deferred.resolve(this.apiKey);
        } else if (apiKeys.length === 0) {
            deferred.reject('No ApiKey is Validate');
        } else {
            async.whilst(()=> {
                    return !this.apiKey && apiKeys.length > 0;
                }, callback => {
                    var apiKey = this.apiKeys.shift();
                    tinify.key = apiKey;
                    tinify.validate((err) => {
                        if (err) {
                            console.log(chalk.red('') + apiKey);
                            index++;
                        } else {
                            console.log(chalk.green('✔ ') + apiKey);
                            this.apiKey = apiKey;
                        }
                        callback(null, apiKey);
                    });
                }, () => {
                    if (this.apiKey) {
                        deferred.resolve(this.apiKey);
                    } else {
                        deferred.reject('No ApiKey is Validate');
                    }
                }
            );
        }

        return deferred.promise;
    };

    this.addFile = function (file, root, dist) {
        this.files.push({file, root, dist});
        this.notify();
    };

    this.notify = function () {
        if (this.tinifying) {
            return;
        }
        async.whilst(()=> {
            return this.files.length;
        }, (callback)=> {
            this.tinifying = true;
            var file = this.files.shift();
            this.findValidateApiKey().then(()=> {
                fs.readFile(file.file, (err, sourceData)=> {
                    tinify.fromBuffer(sourceData).toBuffer((err, resultData) => {
                        var out = path.join(file.dist, path.relative(file.root, file.file));
                        fse.ensureFileSync(out);
                        fs.writeFile(out, resultData, (err) => {
                            console.log(chalk.green('✔ ') + '%j done, save %d%', file.file, ((sourceData.length - resultData.length) * 100 / sourceData.length).toFixed(2));
                            callback();
                        });
                    });
                });
            }, function (err) {
                callback(err);
            });
        }, (err)=> {
            if (err) {
                console.log(chalk.red(err));
            }
            this.tinifying = false
        })
    };
}

module.exports = TinyImages;