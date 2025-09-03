from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
from io import BytesIO
import tensorflow as tf
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://potatodesiesdetection.onrender.com/"],  # your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
MODEL_PATH = MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_models", "potato_model_1.keras")
MODEL = tf.keras.models.load_model(MODEL_PATH)
CLASS_NAMES = ['Early_blight', 'Late_blight', 'Healthy']

@app.get("/ping")
async def ping():
    return"Hello"

def read_files_as_image(data) -> np.ndarray:
   image = np.array(Image.open(BytesIO(data)))
   return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = read_files_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)  # Create a batch
        prediction = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(prediction[0])]
        confidence = np.max(prediction[0])
        return {"predicted_class": predicted_class, "confidence": float(confidence)}
    except Exception as e:
        return {"error":str(e)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
