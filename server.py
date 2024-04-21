from flask import Flask
from flask import render_template 
from flask import Response, request, jsonify
from flask import sessions
from instructions import instructions

import random


app = Flask(__name__)
app.secret_key = 'super secret key'

# Data
quiz = [
    {
        "id": 1, 
        "question": "Using the recipe for the French Martini, please name the liquor and liqueur combination in this amazing drink!",
        "answer1": "Vodka & Chambord",
        "answer2" : "Vodka & Triple Sec",
        "answer3": "Gin & Chambord",
        "answer4": "Rum & Chartreuse",
        "correctanswer": "Vodka & Chambord",
        "description": "Vodka and Chambord is the correct combination of things to make the French Martini, which was not actually invented in France but is a product of the 1980s NYC Cocktail Scene!",
    },
    {
        "id": 2, 
        "question": "Using the provided recipe for the Espresso Martini, how many ounces of coffee liqueur are you supposed to use to create 3 of this drink?",
        "answer1": "1.5 oz",
        "answer2" : "3 oz",
        "answer3": "4.5 oz",
        "answer4": "225 oz",
        "correctanswer": "3 oz",
        "description": "Remember that the recipe for the Espresso Martini contains 1 oz of coffee liqueur per drink! Thus, if you have 3 drinks, you would require 3 oz of coffee liqueur total",
    },
    {
        "id": 3, 
        "question": "What alcohol belongs in an Espresso Martini?",
        "answer1": "Tequila",
        "answer2" : "Whiskey",
        "answer3": "Coffee Liquor",
        "answer4": "Gin",
        "correctanswer": "Coffee Liquor",
        "description": "Remember that Coffee Liquor is a main ingredient in an Espresso Martini",
    },
    {
        "id": 4, 
        "question": "What is the most popular cocktail?",
        "answer1": "Espresso Martini",
        "answer2" : "French Martini",
        "answer3": "Classic Martini",
        "answer4": "Peach Bellini",
        "correctanswer": "Espresso Martini",
        "description": "Espresso Martini is the second most popular cocktail! Right after a Old Fashioned."
    },
]
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

@app.route('/quizquestion/<int:id>')                            #quizquestion Page
def quizquestionPage(id):
    # print(id)
    return render_template("quizquestion.html")

@app.route('/quizcomplete')                            #quizquestion Page
def quizcompetePage():
    return render_template("quizcomplete.html")

#display Quiz Question
@app.route("/quizquestion/quizquestion", methods=["GET", "POST"])
def quizquestion():
    global quiz
    id = request.get_json()
    quizquestion_results = []
    print("Hello hello" + str(id))  #error checking

    # find the name in the mideterrean_food data
    for question in quiz:
        if question["id"] == int(id):
            quizquestion_results.append(question)

    # print(foodpage_results) # error checking
    # print(homepage_results) Used to check if correct data is sending back
    if len(quizquestion_results) != 0:
        return jsonify(question=quizquestion_results)
    else:
        return jsonify("Question Display Failed")

@app.route('/result')                                    
def resultPage():
    return render_template("result.html")

@app.route('/get-bar-items')
def get_items():
    category = request.args.get('category', default = '*', type = str)

    image_list = {
        'liquors' : ['static/images/liquors/vodka.png', 'static/images/liquors/gin.png', 'static/images/liquors/champagne.png'],
        'liqueurs' : ['static/images/liqueurs/coffee.png', 'static/images/liqueurs/chambord.png', 'static/images/liqueurs/triplesec.png'],
        'syrups': ['static/images/syrups/simple.png'],
        'juices-mixer': ['static/images/juices-mixer/espresso.png', 'static/images/juices-mixer/pineapple.png', 'static/images/juices-mixer/peach.png'],
        'glassware': ['static/images/glassware/coupe.png', 'static/images/glassware/martini.png', 'static/images/glassware/flute.png'],
        'ice': ['static/images/ice/ice.png']
    }

    return jsonify(image_list[category])


@app.route('/random-drink')
def random_drinks():
    drinks = ['Classic Martini', 'French Martini', 'Peach Bellini', 'Espresso Martini']
    chosen = random.choice(drinks)
    return jsonify({'drink': chosen,
'TELLMEWHATTODOICANTTHINKFORMYSELF': instructions[chosen]
    
    })

if __name__ == '__main__':
    app.run(debug=True)
