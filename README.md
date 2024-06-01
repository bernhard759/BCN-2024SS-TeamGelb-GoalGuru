# GoalGuru BCN Project

GoalGuru is a web application that lets you predict the outcome of a soccer game.



## Dev information
* Make sure you have Python on your machine or create a virtual environment called env or myenv inside the backend directory
* Install the node modules by running `npm install` inside the frontend directory
* Start the FastAPI Server in the backend (should run on localhost:8000) by running `python server.py` inside the backend directory where the file `server.py` is located.
* Start the React frontend with Vite by running `npm run dev` inside the frontend directory and it should run on localhost:5173. 
* Go to http://localhost:5173 to view the frontend and to http://localhost:8000/api to view the backend api (the routes will change once we get started developing)
* During development you can make fetch requests to the server simply by using the routes defined in the fastapi server file (for example: `fetch("/api", ...);`) because the react frontend is configured to proxy to the backend. When deploying our app we will likely serve the static content from the fastapi server and then the fetch requests should stay the same.
