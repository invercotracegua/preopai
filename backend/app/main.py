from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, requests

app = FastAPI(title="PreopAI Backend")

origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Health(BaseModel):
    status: str

@app.get("/health", response_model=Health)
def health():
    return {"status": "ok"}

@app.post("/preop/submit")
async def submit_preop(
    driver_name: str = Form(...),
    driver_id: str = Form(...),
    plate: str = Form(...),
    findings: str = Form(""),
    photo: UploadFile = File(None)
):
    return {
        "ok": True,
        "driver_name": driver_name,
        "plate": plate,
        "findings": findings,
        "photo_name": photo.filename if photo else None
    }

@app.post("/webhooks/wompi")
async def wompi_webhook(payload: dict):
    return {"received": True}
