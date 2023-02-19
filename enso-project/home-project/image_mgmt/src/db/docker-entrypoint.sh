#!/bin/bash

# Wait for MongoDB to start up
until nc -z -v -w30 mongo 27017
do
  echo "Waiting for MongoDB to start up..."
  sleep 5
done

# Install dependencies
npm install

# Start the server
npm start
