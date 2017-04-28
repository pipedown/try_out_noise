#!/bin/sh

while true; do
    # Use a query that responds quickly but will return an empty result
    curl --max-time 10 --silent -X POST 'http://127.0.0.1:3000/query' -d 'find {"_monitor": == true}'
    EXIT_CODE=$?
    if [ x"$EXIT_CODE" = x"28" ]; then
        # Curl failed due to a timeout, now kill the server
        NOISE_PID=$(systemctl show -p MainPID try-out-noise 2>/dev/null | cut -d= -f2)
        if [ -n "$NOISE_PID" ] && [ x"$NOISE_PID" != x"0" ]; then
            echo "try-out-noise seems to hang, kill it (PID: ${NOISE_PID})!"
            kill -9 $NOISE_PID
        fi
    fi
    sleep 60
done
