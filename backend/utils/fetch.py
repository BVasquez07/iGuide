from openai import OpenAI
from dotenv import dotenv_values
import os
config = dotenv_values(".env")
client = OpenAI(api_key=config["gptKey"])

def getResponse(prompt: str) -> str:
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system", 
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    return completion.choices[0].message.content

