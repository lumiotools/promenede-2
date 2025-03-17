# Use the official Python image from the Docker Hub
FROM python:3.10-slim-bullseye

# Set the working directory
WORKDIR /app


# Copy the requirements file and install dependencies
COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip \
    && pip3 install -r requirements.txt
    
# Copy the environment variables from the .env file
# COPY .env .env

# Expose the port the app runs on
EXPOSE 8000

# Copy the application code
COPY . .

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
