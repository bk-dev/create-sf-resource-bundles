#!/usr/bin/env node

'use strict';

var bundler = require('./lib/bundler'),
    fs = require('fs-extra'),
    del = require('del'),
    builder = require('xmlbuilder'),
    path = require('path'),
    prompt = require('prompt');

var bundlePromises = [],
    directories = getDirectories('.');

var schema = {
    properties: {
        confirm: {
            message: 'Are you sure you want to bundle the following folders? ' + directories + ' (y/n)',
            required: true
        }
    }
};

prompt.start();
prompt.get(schema, (err, info) => {
    if (info.confirm !== 'y') {
        console.log('Static resource bundling aborted.');
        return;
    }

    // Deleting all OSX hidden files related to Finder
    del.sync(['**/.DS_Store']);
    directories.forEach(dir => { bundlePromises.push(buildBundlePromise(dir)) });
    Promise.all(bundlePromises);
});

function buildBundlePromise(dir) {
    return bundler.bundle({ source: './' + dir, target: dir + '.resource' })
        .done(() => {
            var metaXML = builder.create('StaticResource', { encoding: 'UTF-8'})
            .att('xmlns', 'http://soap.sforce.com/2006/04/metadata')
            .ele('cacheControl', 'Public').up()
            .ele('contentType', 'application/zip').up()
            .ele('description', dir + ' resource bundle').up()
            .end({
                pretty: true,
                indent: '    ',
                newline: '\n'
            });

            fs.writeFileSync('./' + dir + '.resource-meta.xml', metaXML);
        });
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath)
        .filter(file => fs.lstatSync(path.join(srcPath, file)).isDirectory());
}