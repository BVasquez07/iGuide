from config import config

def getResponse(prompt: str, client) -> str:
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": config["SystemMessage"]
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

