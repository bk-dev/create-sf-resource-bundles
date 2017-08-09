Provides a simple way of creating Salesforce static resources and accompanying meta-xml files of all folders in the current working directory.

## Install

```
$ npm install ma-create-bundles -g
```

## Usage

```
$ ma-create-bundles
```

A prompt will appear with the folders that will be processed. If you respond with 'y' then all of the listed folders will be zipped up into Salesforce static resource files. Additionally, meta-xml files will also be created for each listed folder. This will prepare all of the static resources for deployment to a Salesforce org.

NOTE: Any existing static resource files with the same folder name will be overwritten.