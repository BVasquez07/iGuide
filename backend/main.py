from flask import Flask, jsonify, Request
import utils.fetch
from random import randint

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def root():
    return "<p>Hello, World!</p>"


@app.route("/gptRes", methods=['GET', 'POST'])
def gptRes():
    return jsonify(
        {
            "data": utils.fetch.getResponse("What is hololive?")
         })


if __name__ == "__main__":
    app.run(host='localhost', port=3060)