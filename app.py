from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# List of possible answers
answers = [
    "Yes, definitely", "Yes, absolutely", "You can count on it", "Most likely", "Yes", 
    "Outlook good", "Yes, in due time", "Without a doubt", "Definitely not", "My sources say yes",
    "No", "No, not at all", "My sources say no", "Very unlikely", "Don't count on it",
    "Ask again later", "Cannot predict now", "Concentrate and ask again", "Not sure, try again", "My reply is no",
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask')
def ask():
    return jsonify(answer=random.choice(answers))

if __name__ == '__main__':
    app.run(debug=True)
