# import json
# import pytest
# from app import app

# for all test to be TDD /BDD we will generate the data passed as must args to the route tests with additonal files
# holding  lists of all methods we want to try ,payloads ,status code support etc and pass them to the test with :
# "@pytest.mark.parametrize(" method_name, payload,query params,  run_request ", parm_consts.SCENARIO_REQUEST_PARAMS)"
# im adding here some basic test with static data that should be passed to it  as i mentioned above in real test

# exmaple :
# import json
# from app import app

#@pytest.fixture
# def client():
#     client = app.test_client()
#     yield client

# def test_get_images_success(client):
#     res = client.get('/images?page=1&limit=10')
#     assert res.status_code == 200
#     assert res.content_type == 'application/json'
#     data = json.loads(res.get_data())
#     assert len(data['images']) <= 10
#
# def test_get_images_invalid_page_parameter(client):
#     res = client.get('/images?page=0&limit=10')
#     assert res.status_code == 400
#
# def test_get_images_invalid_limit_parameter(client):
#     res = client.get('/images?page=1&limit=-1')
#     assert res.status_code == 400
#
# def test_get_images_server_error(client, monkeypatch):
#     def mock_image_find(*args, **kwargs):
#         raise Exception('Test Exception')
#     monkeypatch.setattr('models.Image.find', mock_image_find)
#     res = client.get('/images?page=1&limit=10')
#     assert res.status_code == 500


# @pytest.fixture
# def client():
#     client = app.test_client()
#     yield client
#
#
# def test_get_deployments(client):
#     #validate expected return value as list of deploymnets and results are int
#     response = client.get('/deployments?page=1&limit=10')
#     assert response.status_code == 200
#
#     data = json.loads(response.data)
#     assert 'deployments' in data
#     assert 'totalResults' in data
#     assert isinstance(data['deployments'], list)
#     assert isinstance(data['totalResults'], int)

#more tests that are must :
# validate api connection
# validate api response
# validate given params sent in query params
# validate given params sent in query params are not none
# validate given params sent in query params are valid type
# validate given params sent in query params are valid by route response results
# validate api response with proper error when a must argument is needed

#more test examples (note!!! these static values should be also generated/pass from external list/dict of test possibilities we want
# import requests
# def test_upsert_image():
#     #for TDD/BDD we will generate the data
#     url = "http://localhost:3000/images/upsert"
#     data = {
#         "id": "image-1",
#         "name": "Test Image",
#         "repository": "test/image",
#         "version": "1.0.0",
#         "metadata": {
#             "description": "Test image for pytest",
#             "author": "pytest"
#         }
#     }
#     response = requests.post(url, json=data)
#     assert response.status_code == 200
#     assert response.json()["id"] == "image-1"
#     assert response.json()["name"] == "Test Image"
#     assert response.json()["repository"] == "test/image"
#     assert response.json()["version"] == "1.0.0"
#     assert response.json()["metadata"]["description"] == "Test image for pytest"
#     assert response.json()["metadata"]["author"] == "pytest"
#
