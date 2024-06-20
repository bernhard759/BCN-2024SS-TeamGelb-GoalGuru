# GoalGuru BCN Project

<hr>
Frontend testing    

[![codecov](https://codecov.io/gh/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/graph/badge.svg?token=FAP45UOB0Y?flag=frontend)](https://codecov.io/gh/bernhard759/BCN-2024SS-TeamGelb-GoalGuru)

CI/CD    

[![Workflow Status](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/ci-cd.yml/badge.svg?branch=prod)](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/ci-cd.yml)
 [![Docker Compose](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/ci-cd.yml/badge.svg?event=push&branch=prod&job=docker_compose)](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/ci-cd.yml)

Project info    

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js Version](https://img.shields.io/badge/node-20-green.svg)](https://nodejs.org/en/) [![Python Version](https://img.shields.io/badge/python-3.9-blue.svg)](https://www.python.org/downloads/release/python-390/)

<hr>

GoalGuru is a web application that lets you predict the outcome of a soccer game. Th eproject uses a FastAPI Python backend for prediction and a React frontend to display the predictions.


## Dev information
* Make sure you have Python on your machine or create a virtual environment called env or myenv inside the backend directory
* Install the node modules by running `npm install` inside the frontend directory
* Start the FastAPI Server in the backend (should run on localhost:8000) by running `python server.py` inside the backend directory where the file `server.py` is located.
* Start the React frontend with Vite by running `npm run dev` inside the frontend directory and it should run on localhost:5173. 
* Go to http://localhost:5173 to view the frontend and to http://localhost:8000/api to view the backend api (the routes will change once we get started developing)
* During development you can make fetch requests to the server simply by using the routes defined in the fastapi server file (for example: `fetch("/api", ...);`) because the react frontend is configured to proxy to the backend. When deploying our app we will likely serve the static content from the fastapi server and then the fetch requests should stay the same.

* The project uses Docker. We have a Dockerfile that builds an image of our app. The Dockerfile is used with a simple `docker-compose.yml` file.

* For Deployment we use Github Actions to build and push a Docker image of the backend that also serves the build code from the frontend. This action gets triggered when pushing on the prod branch

## 
