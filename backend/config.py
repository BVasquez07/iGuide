from openai import OpenAI
from dotenv import dotenv_values

config = {
    "OpenAiClient": OpenAI(api_key=dotenv_values(".env")["gptKey"]),
    "SystemMessage": 
                "You are a helpful assistant assigned as a guide for Blind and low vision users, you serve as the vocal interface for a robotic dog spot.",    
}
    