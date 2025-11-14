from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter(prefix="/api", tags=["game"])

OLLAMA_URL = f"http://{os.getenv('OLLAMA_HOST', 'ollama')}:{os.getenv('OLLAMA_PORT', '11434')}"

class QuestionRequest(BaseModel):
    interests: list[str]
    profession: str

class AnswerRequest(BaseModel):
    question: str
    userAnswer: str
    context: dict

@router.post("/generate-question")
async def generate_question(request: QuestionRequest):
    prompt = f"""
    Generate an engaging educational question for a {request.profession} 
    interested in {', '.join(request.interests)}. 
    The question should be challenging but fair, and related to their interests.
    Return only the question without any additional text.
    """
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "mistral",
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return {"question": result.get("response", "").strip()}
            else:
                raise HTTPException(status_code=500, detail="Failed to generate question")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-answer")
async def check_answer(request: AnswerRequest):
    prompt = f"""
    Question: {request.question}
    User's Answer: {request.userAnswer}
    
    Evaluate if this answer is correct. Consider the user's background: 
    {request.context.get('profession', '')} interested in {', '.join(request.context.get('interests', []))}
    
    Provide a JSON response with:
    - correct: boolean
    - correctAnswer: the accurate answer if wrong
    - explanation: brief explanation
    """
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "mistral",
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                # Parse the response (this is simplified)
                result = response.json().get("response", "")
                return {
                    "correct": True,  # Simplified logic
                    "correctAnswer": "Sample correct answer",
                    "explanation": "Good job!"
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to check answer")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))