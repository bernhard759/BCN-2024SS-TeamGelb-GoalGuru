# Build the React frontend
FROM node:20-alpine as frontend-build
WORKDIR /app
COPY ./frontend/package.json ./
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend .
RUN npm run build

# Build the FastAPI backend
FROM python:3.10-slim as backend-build
WORKDIR /app
COPY ./backend .
RUN pip install --no-cache-dir -r requirements.txt

# Final image
FROM backend-build as final

# Copy the frontend build artifacts from the frontend-build stage
COPY --from=frontend-build /app/dist /app/frontend

# Set the environment variable for the frontend directory
ENV FRONTEND_DIR=/app/frontend

# Expose the port for the FastAPI application
EXPOSE 8000

# Start the FastAPI application and serve the frontend
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
