#!/usr/bin/env bash
# I don't have a better way to pass double quotes to docker CMD/ENTRYPOINT
# Sorry about it :P
node /app/ganache-core.docker.cli.js --quiet \
-p 8546 \
--account="0x50d95f633d5edf84940369b152f3adef2b3944d04c7764ac2e855d2853286692,100000000000000000000" \
--account="0xa0b90c598d71cb84cc9b86fcdb13cdf0d7c64ea42ad54381fef92805e103fb41,100000000000000000000"