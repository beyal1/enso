
# Build the MongoDB image
FROM mongo:4
ENV MONGO_URI mongodb://mongodb:27017/docker-mongo

COPY . .

# Create a directory to store MongoDB data
RUN mkdir -p /data/db
# Start the MongoDB server
CMD ["docker-entrypoint.sh", "mongod", "--bind_ip_all"]
