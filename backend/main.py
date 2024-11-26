from flask import Flask, jsonify
from dotenv import load_dotenv
import utils.fetch
from random import randint

load_dotenv()

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def root():
    return "<p>Hello, World!</p>"


@app.route("/gptRes", methods=['GET', 'POST'])
def gptRes():
    return jsonify(
        {
            "data": f'This will deliver and get the response payload from gpt for now we have a random num here: {randint(1, 1000)}'
         })


if __name__ == "__main__":
    app.run(host='localhost', port=3060)