1. ~~参考~~抄袭网址：[js+php分片上传大文件](http://www.php.cn/php-weizijiaocheng-393275.html)。
2. 需要根据自己对上传视频的限制来修改php.ini中的内容，例如：
```
max_file_uploads=10000 // 传送文件的数量最多为10000
post_max_size=200M // 通过post请求传送文件的最大大小为200M
upload_max_filesize=128M // 最大的上传文件的大小为128M
```

