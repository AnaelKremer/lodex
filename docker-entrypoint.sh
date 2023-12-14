#!/bin/sh
redis-server &
# wait $! no working on ezmaster so use sleep
sleep 1
# redis-cli FLUSHALL || Disabling this command to avoid flushing the redis database
find /app/src/app/custom ! -user daemon -exec chown daemon:daemon {} \; &
find /tmp ! -user daemon -exec chown daemon:daemon {} \; &

# Allows you to override or add configuration files to a local instance
find /app/src/app/custom/exporters/ -name \*.ini -exec cp -v -f {} /app/workers/exporters/ \;
find /app/src/app/custom/routines/ -name \*.ini -exec cp -v -f {} /app/workers/routines/ \;
find /app/src/app/custom/loaders/ -name \*.ini -exec cp -v -f {} /app/workers/loaders/ \;

exec su-exec daemon:daemon $*
