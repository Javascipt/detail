# detail

![Detail](https://travis-ci.org/Javascipt/detail.svg)

The detail command allows you to get information about a nodejs package or project on a web page browsed using your default web browser.

### Installation
The detail package needs to be installed globally:
```sh
$ npm install -g detail
```

### How does it work
Once installed, you can run the command `detail` with path to your project as argument
```sh
$ detail /path/to/your/project
```
or 
```sh
$ cd /path/to/your/project
$ detail
```

If you want to get details of a node module, you can run the command 
```sh
$ detail /path/to/your/project moduleName
```

Or simply run the command `detail` with `-m` option:
```sh
$ detail -m moduleName
```

To get details of globally installed modules, simply use the `-g` option:
```sh
$ detail -g moduleName
```

## License
MIT