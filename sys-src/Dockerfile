# Build the React frontend
FROM node:14-alpine as frontend-build
WORKDIR /app/frontend
COPY ./frontend .
RUN npm install
RUN npm run build

# Build the FastAPI backend
FROM python:3.9-slim as backend-build
WORKDIR /app/backend
COPY ./backend .
RUN pip install --no-cache-dir -r requirements.txt

# Final image
FROM python:3.9-slim as final
WORKDIR /app

# Copy the frontend build artifacts
COPY --from=frontend-build /app/frontend/dist /app/frontend

# Copy the backend code and dependencies
COPY --from=backend-build /app/backend .

# Set the environment variable for the frontend directory
ENV FRONTEND_DIR=/app/frontend

# Expose the port for the FastAPI application
EXPOSE 8000

# Start the FastAPI application and serve the frontend
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
