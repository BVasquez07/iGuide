from flask import Flask, jsonify, request
from flask_cors import CORS
import utils.fetch
from config import config

app = Flask(__name__)
CORS(app)

try:
    GPT_CLIENT = config["OpenAiClient"]
except Exception as e:
    print(f'There was an starting up the GPT LLM Client: {e}')
    exit()

@app.route("/", methods=['GET', 'POST'])
def root():
    return "<p>Hello, World!</p>"


#here we want to take information from the body req and pass it into the getResponse call.
@app.route("/gptRes", methods=['POST', 'GET'])
def gptRes():
    PROMPT = request.json["prompt"]
    if PROMPT == "": return {"data": "There was no prompt passed"}
    return jsonify({"data": utils.fetch.getResponse(PROMPT, GPT_CLIENT)})


if __name__ == "__main__":
    app.run(host='localhost', port=3060)