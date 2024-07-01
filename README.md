# GoalGuru BCN Project

<hr>
Frontend testing    

[![codecov](https://codecov.io/gh/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/branch/main/graph/badge.svg?token=FAP45UOB0Y)](https://codecov.io/gh/bernhard759/BCN-2024SS-TeamGelb-GoalGuru)

CI/CD    

[![Build and Push Docker Image](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/docker.yml/badge.svg)](https://github.com/bernhard759/BCN-2024SS-TeamGelb-GoalGuru/actions/workflows/docker.yml)

Project info    

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js Version](https://img.shields.io/badge/node-20-green.svg)](https://nodejs.org/en/) [![Python Version](https://img.shields.io/badge/python-3.9-blue.svg)](https://www.python.org/downloads/release/python-390/)

<hr>

## Project description

GoalGuru is a web application that lets you predict the outcome of a soccer game. Th eproject uses a FastAPI Python backend for prediction and a React frontend to display the predictions.


## Dev information
* Make sure you have Python on your machine or create a virtual environment called env or myenv inside the backend directory

* Install the node modules by running `npm install` inside the frontend directory

* Start the FastAPI Server in the backend (should run on localhost:8000) by running `python server.py` inside the backend directory where the file `server.py` is located.

* Start the React frontend with Vite by running `npm run dev` inside the frontend directory and it should run on localhost:5173. 

* Go to http://localhost:5173 to view the frontend and to http://localhost:8000/api to view the backend api

* During development you can make fetch requests to the server simply by using the reltive routes defined in the fastapi server file because the react frontend is configured to proxy to the backend. When deploying our app we will likely serve the static content from the fastapi server and then the fetch requests should stay the same.

* The project uses Docker. We have a Dockerfile that builds an image of our app. The Dockerfile is used with a simple `docker-compose.yml` file. You can run the app in a container with the command `docker compose up`.

* For Deployment we use Github Actions to build and push a Docker image of the backend that also serves the build code from the frontend. This action gets triggered when pushing on the prod branch

### Workflow and commands

#### Setup

This monorepo contains two services: frontend and backend.

To install the dependencies for both services, run the following: 

```
cd sys-src/backend
pip install -r requirements.txt
```

```
cd sys-src/frontend 
npm install
```


#### Frontend commands

Go to the frontend directory  with `cd sys-src/frontend`  

| command  | description  |  
|---|---|  
| `npm run dev`  |  Run the frontend React app in dev mode |   
| `npm run build`  | Build the React app (the build code will be inside the `dist` folder)  |
| `npm run test` | Run the frontend tests using vitest |
| `npm run test:coverage` | Run the frontend tests using vitest and show the coverage report in the console |
| `npm run lint` | Start eslint static code analysis |


#### Backend commands

Go to the backend directory  with `cd sys-src/backend`  

| command  | description  |  
|---|---| 
| `python server.py`  | Start the FastAPI server  |   
| `pytest tests/`  | Run the backend tests  |

#### Docker commands

Go to the source code directory  with `cd sys-src`  


| command  | description  |  
|---|---| 
| `docker compose up --build`  |  Build image and run the docker-compose.yml file that starts the container |   
| `docker compose up`  |  Run the docker-compose.yml file that starts the container from the Docker image |  
| `docker compose -f docker-compose.dev.yml up` | Run the dev docker compose file | 

### Git

We use the Gihub flow here.

1. Create a new feature branch
```
git checkout -b feature/your-feature-name
```

2. Make changes and commit
```
git add .
git commit -m "Describe your changes"
```

3. Push changes to GitHub
```
git push origin feature/your-feature-name
```

4. Merge your feature branch into the main branch using the `--no-ff` option

5. Update your local main branch
```
git checkout main
git pull origin main
```

