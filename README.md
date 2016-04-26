 ![image](https://github.com/gexiaowei/tinyImages/raw/master/logo.jpg)

Minify Images by using TinyPNG API

## How to install

```
npm install tinyImages -g
```

### How to use  CLI?

```
  Usage: tiny-images [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -a, --add [api_key]  Add api key to TinyImages
    -d, --dir [path]     File or directory path for tiny images  - defaults to ./
    -t, --target [path]  directory for output tinify images  - defaults to ./
```

#### Examples:

To add a **Tiny PNG API key** do:

```
tiny-images -a "api key here"
```

To minify the images do:

```
tiny-images -d "file or directory path" -t "output path"
```

