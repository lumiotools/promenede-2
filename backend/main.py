import sys
sys.dont_write_bytecode = True
from dotenv import load_dotenv
load_dotenv()

import os
import uvicorn
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from src.routes.company.router import router as companyRouter

app = FastAPI()

# Configure CORS with more permissive settings
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://promenede-2.vercel.app",
    "https://www.promenede-2.vercel.app",
    "https://promenede-2.onrender.com",
    "https://www.promenede-2.onrender.com",
    # It's safer to use specific origins, but you can use "*" for testing
    # "*"
]

# Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://(.*\.)?promenede-2\.vercel\.app",  # Allows all subdomains
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"],
    max_age=86400  # Cache preflight requests for 24 hours
)

# Include routers
app.include_router(companyRouter, prefix="/company")

# Test routes - do not expose them in production
@app.get("/")
async def root():
    return {"message": "Server is up and running!"}

# Add a CORS test endpoint
@app.options("/cors-test")
@app.get("/cors-test")
async def cors_test():
    return {"message": "CORS is working!"}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error occurred: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred. Please try again later."},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error occurred: {exc}")
    return JSONResponse(
        status_code=422,
        content={"error": "Validation error", "details": exc.errors()},
    )

if __name__ == "__main__":
    environment = os.getenv("ENVIRONMENT")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=(environment == "dev"))