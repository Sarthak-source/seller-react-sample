#!/bin/sh

echo "Switching to branch master"
git checkout main

echo "Building app"
yarn run build

echo "Deploying files to server"
scp -r dist/* root@172.105.35.51:/var/www/172.105.35.51
echo "Deployment complete"