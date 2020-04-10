server="root@39.100.127.116"

path="/var/www/html/mingou"

scp -r build/* ${server}:${path}

echo "\033[32;5m==================已上传至服务👌==================\033[0m" 