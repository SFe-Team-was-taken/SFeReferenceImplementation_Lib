#!/bin/bash
cd "$(dirname "$0")" || exit

cd ..

npm uninstall spessasynth_core
npm install spessasynth_core
npm pkg set dependencies.spessasynth_core=latest
npm update
npm run build