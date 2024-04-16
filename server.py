from flask import Flask
from flask import render_template 
from flask import Response, request, jsonify
app = Flask(__name__)

# Routes
@app.route("/hidden")
def hidden():
    return 'Hello from the dark side'

@app.route('/')                                         #Homepage
def homePage():
    return render_template("homepage.html")

@app.route('/drinks')                                   #Drinkpage
def drinkPage():
    return render_template("drinks.html")

@app.route('/quiz')                                     #Quizpage
def quizPage():
    return render_template("quiz.html")

@app.route('/bartender')                                #bartenderpage
def bartenderPage():
    return render_template("bartender.html")

if __name__ == '__main__':
    app.run(debug=True)
