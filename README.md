 ![image](https://github.com/gexiaowei/tinyImages/raw/master/logo.jpg)

Minify Images by using TinyPNG API

### How to use  CLI?

```
tiny-images [options]

-h, --help                     output usage information
-v, --version                  output the version number
-a, --add [api_key]            Add api key to TinyImages
-d, --dir [path]               File or directory path for tiny images  - defaults to ./
-t, --target [path]            Directory for output tinify images  - defaults to ./
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

