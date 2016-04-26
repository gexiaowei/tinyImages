#!/usr/bin/env node

var TinyImage = require('../lib/tiny');

var fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    tinify = require("tinify"),
    chalk = require("chalk"),
    async = require("async"),
    Q = require("q"),
    program = require('commander'),
    mime = require('mime');

var packageInfo = require('../package.json');

var root = "./", dist = "./";

program
    .version(packageInfo.version)
    .option('-a, --add [api_key]', 'Add api key to TinyImages')
    .option('-d, --dir [path]', 'File or directory path for tiny images  - defaults to ./')
    .option('-t, --target [path]', 'directory for output tinify images  - defaults to ./')
    .parse(process.argv);

var tinyImage = new TinyImage();

var apiKeyForAdd = program.add;

if (apiKeyForAdd) {
    tinyImage.addApiKey(apiKeyForAdd);
    return;
}

getWorkPath(program.dir || root).then((path)=> {
    console.log('input:%s', path);
    root = path;
    return getWorkPath(program.target || dist);
}).then((path)=> {
    console.log('output:%s', path);
    dist = path;
    return readyToTinify();
}).then((directory)=> {
    findFiles(directory);
}, (file)=> {
    if (isImage(file)) {
        tinyImage.addFile(file, path.dirname(file), dist);
    }
});


function findFiles(directory) {
    var files = fs.readdirSync(directory);
    files.forEach((file)=> {
        file = path.join(directory, file);
        if (fs.lstatSync(file).isFile() && isImage(file)) {
            tinyImage.addFile(file, root, dist);
        } else if (fs.lstatSync(file).isDirectory()) {
            findFiles(file);
        }
    });
}

function isImage(file) {
    return ['image/jpeg', 'image/jpg', 'image/png'].indexOf(mime.lookup(file)) >= 0;
}

function readyToTinify() {
    var deferred = Q.defer();
    //1.判断dir是否为文件
    if (fs.lstatSync(root).isDirectory() && fs.existsSync(root)) {
        deferred.resolve(root);
    }

    //2.判断是否为文件
    if (fs.lstatSync(root).isFile() && fs.existsSync(root)) {
        deferred.reject(root);
    }

    return deferred.promise;
}


function getWorkPath(path) {
    var deferred = Q.defer();
    fs.realpath(path, (err, path)=> {
        if (err) {
            fse.ensureDirSync(err.path);
        }
        deferred.resolve(path || err.path);
    });
    return deferred.promise;
}