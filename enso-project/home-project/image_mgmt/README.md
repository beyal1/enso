
# Installation Instructions

Clone the repo to your selected location
CD to : enso-project/home-project/image_mgmt
setup the framework with docker : docker-compose build  --parallel && docker-compose up -d
(this will raise the API docker ,mongoDb and nginx)
nginx will route the requests from localhost:4000 in your browser 

#API Usage example:(also look at the swagger.json /api-doc in the api itself)
create first image : open terminal and send :
images/upsert route:
"curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>"
-d '{"id": "1", "name": "my-image",
"repository": "my-repo", "version": "1.0.0", "metadata": {"key1": "value1", "key2": "value2"}}'
http://localhost:4000/images/upsert"

response:
"{"_id":"63f22cf2d948147adaf7cd05","id":"1","__v":0,"createdAt":"2023-02-19T14:06:42.559Z","metadata":{"key1":"value1","key2":"value2"},"updatedAt":"2023-02-19T14:06:42.559Z"}%"

get the info - use the images route:
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" 
http://localhost:4000/images?limit=10&page=2

response :("if no images are found") :
{"images":[],"totalResults":0}% 

deployment/make:
curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "imageId": "1234"}' http://localhost:4000/deployment/make
response:
{"id":"1","imageId":"1234","_id":"63f235d0a1a6c819a777b205","createdAt":"2023-02-19T14:44:32.249Z","updatedAt":"2023-02-19T14:44:32.249Z","__v":0}

deployment/
curl -X GET "http://localhost:4000/deployments?page=1&limit=10" -H "accept: application/json"
response :
{"deployments":[{"_id":"63f235d0a1a6c819a777b205","id":"1","imageId":"1234","createdAt":"2023-02-19T14:44:32.249Z","updatedAt":"2023-02-19T14:44:32.249Z","__v":0}]
,"totalResults":1}



