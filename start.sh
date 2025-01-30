#!/bin/bash

# 检查端口是否被占用，如果是则关闭对应进程
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 8000 is in use. Attempting to kill the process..."
    lsof -ti:8000 | xargs kill -9
    sleep 1
fi

echo "Starting local server on http://localhost:8000"
python3 -m http.server 8000 



