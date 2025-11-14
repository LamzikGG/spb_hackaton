from fastapi import FastAPI
from app.routes import auth, users
from app.config import settings
import uvicorn

app = FastAPI(
    title="SPB Hackaton Backend",
    description="Backend API with JSON storage authentication",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/auth")
async def root():
    return {"message": "SPB Hackaton Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/message_user")
async def message_send():
    return
@app.get("/message_get")
async def message_get():
    return

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)