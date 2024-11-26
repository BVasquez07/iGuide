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
                "content": "You are a helpful assistant assigned as a guide for Blind and low vision users, you serve as the vocal interface for a robotic dog spot."
            },
            {
                "role": "user",
                "content": prompt
            },
            {
                "role": "assistant",
                "content": "no cache available"
            },
        ]
    )
    return completion.choices[0].message.content

