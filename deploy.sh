#!/bin/sh

echo "Switching to branch master"
git checkout sutra-react

echo "Building app"
yarn run build

echo "Deploying files to server"
scp -r build/* root@172.105.35.51:/var/www/172.105.35.51
echo "Deployment complete"