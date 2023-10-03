#!/bin/sh

{
    pushd ../.. && \
    npx nestia sdk && \
    popd && \
    rimraf dist && \
    tsc && \
    find dist -type f ! -path "dist/client/*" | grep .js | xargs rm
} || true

rimraf ../../src/client