from flask import Flask
from flask import render_template 
from flask import Response, request, jsonify
from flask import sessions
from instructions import instructions
import json
import random

app = Flask(__name__)
app.secret_key = 'super secret key'

#Set that stores all the questoin ids
random_int_set = set()

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
        "answer1": "1.50 oz",
        "answer2" : "3.00 oz",
        "answer3": "4.50 oz",
        "answer4": "225.00 oz",
        "correctanswer": "3.00 oz",
        "description": "Remember that the recipe for the Espresso Martini contains 1 oz of coffee liqueur per drink! Thus, if you have 3 drinks, you would require 3 oz of coffee liqueur total!",
    },
    {
        "id": 3, 
        "question": "What alcohol belongs in an Espresso Martini?",
        "answer1": "Tequila",
        "answer2" : "Whiskey",
        "answer3": "Coffee Liqueur",
        "answer4": "Raspberry Liqueur",
        "correctanswer": "Coffee Liqueur",
        "description": "Remember that Coffee Liquor is a main ingredient in an Espresso Martini!",
    },
    {
        "id": 4, 
        "question": "From the drinks below, what is the most popular martini?",
        "answer1": "Espresso Martini",
        "answer2" : "French Martini",
        "answer3": "Classic Martini",
        "answer4": "Peach Bellini",
        "correctanswer": "Espresso Martini",
        "description": "Espresso Martini is the second most popular cocktail! Right after an Old Fashioned!"
    },
    {
        "id": 5, 
        "question": "Which of the following drinks contains caffeine?",
        "answer1": "Espresso Martini",
        "answer2" : "Peach Bellini",
        "answer3": "Classic Martini",
        "answer4": "French Martini",
        "correctanswer": "Espresso Martini",
        "description": "The Espresso Martini contains coffee liqueur which has around 9mg of caffeine."
    },
    {
        "id": 6, 
        "question": "What drink is prepared in a chilled champagne flute?",
        "answer1": "Classic Martini",
        "answer2" : "French Martini",
        "answer3": "Espresso Martini",
        "answer4": "Peach Bellini",
        "correctanswer": "Peach Bellini",
        "description": "A Peach Bellini is prepared in a chilled champagne flute. A Classic Martini is prepared in a martini glass. An Espresso Martini and a French Martini are prepared in a chilled coupe glass!"
    },
    {
        "id": 7, 
        "question": "What liqueur is used in a French Martini?",
        "answer1": "Raspberry Liqueur",
        "answer2" : "Coffee Liqueur",
        "answer3": "Banana Liqueur",
        "answer4": "Chocolate Liqueur",
        "correctanswer": "Raspberry Liqueur",
        "description": "An important ingredient in a French Martini is Raspberry Liqueur!"
    },
    {
        "id": 8, 
        "question": "What is the main ingredient in a Peach Bellini?",
        "answer1": "Champagne",
        "answer2" : "Vodka",
        "answer3": "Tequila",
        "answer4": "Gin",
        "correctanswer": "Champagne",
        "description": "The main ingredient in a Peach Bellini is Champagne!"
    },
    {
        "id": 9, 
        "question": "Which drink has Dry Vermouth in it?",
        "answer1": "Espresso Martini",
        "answer2" : "Peach Bellini",
        "answer3": "Classic Martini",
        "answer4": "French Martini",
        "correctanswer": "Classic Martini",
        "description": "Vermouth is one of two defining ingredients in a Classic Martini!"
    },
    {
        "id": 10, 
        "question": "Which drink contains Pineapple Juice?",
        "answer1": "Classic Martini",
        "answer2" : "French Martini",
        "answer3": "Espresso Martini",
        "answer4": "Peach Bellini",
        "correctanswer": "French Martini",
        "description": "The Pineapple Juice is one of the ingredients that gives the French Martini it's unqiue flavor!"
    },
    {
        "id": 11, 
        "question": "What alcohol belongs in an French Martini?",
        "answer1": "Tequila",
        "answer2" : "Whiskey",
        "answer3": "Coffee Liqueur",
        "answer4": "Raspberry Liqueur",
        "correctanswer": "Raspberry Liqueur",
        "description": "Remember that Respberry Liquor (Chambord) is a main ingredient in an French Martini!",
    },
    {
        "id": 12, 
        "question": "Which drink contains Peach Juice?",
        "answer1": "Classic Martini",
        "answer2" : "French Martini",
        "answer3": "Espresso Martini",
        "answer4": "Peach Bellini",
        "correctanswer": "Peach Bellini",
        "description": "The Peach Juice is one of the ingredients that gives the Peach Bellini it's unqiue flavor!"
    },
    {
        "id": 13, 
        "question": "How many ounces of Vodka are in an Espresso Martini?",
        "answer1": "1.50 oz",
        "answer2" : "3.00 oz",
        "answer3": "4.50 oz",
        "answer4": "2.00 oz",
        "correctanswer": "1.50 oz",
        "description": "Remember that the recipe for the Espresso Martini contains 1.50 oz of vodka!" 
    },
    {
        "id": 14, 
        "question": "How many ounces of Coffee Liqueur are in an Espresso Martini?",
        "answer1": "1.50 oz",
        "answer2" : "3.00 oz",
        "answer3": "1.00 oz",
        "answer4": "2.00 oz",
        "correctanswer": "1.00 oz",
        "description": "The recipe for the Espresso Martini contains 1.00 oz of coffee liqueur!"
    },
    {
        "id": 15, 
        "question": "How many ounces of Simple Syrup are in an Espresso Martini?",
        "answer1": "1.50 oz",
        "answer2" : "3.00 oz",
        "answer3": "1.00 oz",
        "answer4": "0.50 oz",
        "correctanswer": "0.50 oz",
        "description": "Remember if you would like to add simple syrup to your Espresso Martini, you should add 0.50 oz!"
    },
    {
        "id": 16, 
        "question": "How many ounces of Espresso Shots are in an Espresso Martini?",
        "answer1": "1.50 oz",
        "answer2" : "3.00 oz",
        "answer3": "1.00 oz",
        "answer4": "0.50 oz",
        "correctanswer": "1.50 oz",
        "description": "The recipe for the Espresso Martini contains 1.50 oz of espresso shots. That is exactly one shot of espresso!"
    },
    {
        "id": 17, 
        "question": "What glass is an Espresso Martini prepared in?",
        "answer1": "Coupe glass",
        "answer2" : "Champagne flute glass",
        "answer3": "Martini glass",
        "answer4": "Collins glass",
        "correctanswer": "Coupe glass",
        "description": "An Espresso Martini is traditionally prepared in a chilled coupe glass!"
    },
    {
        "id": 18, 
        "question": "What glass is a Classic Martini prepared in?",
        "answer1": "Coupe glass",
        "answer2" : "Champagne flute glass",
        "answer3": "Martini glass",
        "answer4": "Collins glass",
        "correctanswer": "Martini glass",
        "description": "An Classic Martini is traditionally prepared in a Chilled Martini glass!"
    },
    {
        "id": 19, 
        "question": "How many ounces of Gin are in a Classic Martini?",
        "answer1": "3.50 oz",
        "answer2" : "1.00 oz",
        "answer3": "2.00 oz",
        "answer4": "5.50 oz",
        "correctanswer": "2.00 oz",
        "description": "A Classic Martini has 2.00 oz of Gin. That's what gives it the unique and bold flavor!"
    },
    {
        "id": 20, 
        "question": "What is the liquor used in an Classic Martini?",
        "answer1": "Vodka",
        "answer2" : "Gin",
        "answer3": "Champagne",
        "answer4": "Tequila",
        "correctanswer": "Gin",
        "description": "The Gin gives the Classic Martini its unique and bold flavor!"
    },
    {
        "id": 21, 
        "question": "What is the liqueur used in an Classic Martini?",
        "answer1": "Coffee Liqueur",
        "answer2" : "Raspberry Liqueur",
        "answer3": "Dry Vermouth",
        "answer4": "Banana Liqueur",
        "correctanswer": "Dry Vermouth",
        "description": "The Dry Vermouth gives the Classic Martini its sweetness!"
    },
    {
        "id": 22, 
        "question": "What is the liquor used in an Peach Bellini?",
        "answer1": "Vodka",
        "answer2" : "Gin",
        "answer3": "Champagne",
        "answer4": "Tequila",
        "correctanswer": "Champagne",
        "description": "The Champagne gives the Peach Bellini its unique flavor!"
    },
    {
        "id": 23, 
        "question": "How many ounces of Champagne are in a Peach Bellini?",
        "answer1": "1.50 oz",
        "answer2" : "4.50 oz",
        "answer3": "3.00 oz",
        "answer4": "5.50 oz",
        "correctanswer": "3.00 oz",
        "description": "Remember that the recipe for the Peach Bellini contains 3.00 oz of Champange!"
    },
    {
        "id": 24, 
        "question": "How many ounces of Peach Juice are in a Peach Bellini?",
        "answer1": "0.50 oz",
        "answer2" : "3.50 oz",
        "answer3": "2.00 oz",
        "answer4": "5.50 oz",
        "correctanswer": "2.00 oz",
        "description": "The recipe for the Peach Bellini contains 2.00 oz of Peach Juice. That gives it a tropically flavor!"
    },
    {
        "id": 25, 
        "question": "What glass is a French Martini prepared in?",
        "answer1": "Coupe glass",
        "answer2" : "Champagne Flute glass",
        "answer3": "Martini glass",
        "answer4": "Collins glass",
        "correctanswer": "Coupe glass",
        "description": "A French Martini is traditionally prepared in a Chilled Coupe glass!"
    },
    {
        "id": 26, 
        "question": "What is the liquor used in an French Martini?",
        "answer1": "Vodka",
        "answer2" : "Gin",
        "answer3": "Champagne",
        "answer4": "Tequila",
        "correctanswer": "Vodka",
        "description": "Adding Vodka is the first step when preparing a French Martini!"
    },
    {
        "id": 27, 
        "question": "How many ounces of Vodka are in a French Martini?",
        "answer1": "1.50 oz",
        "answer2" : "5.50 oz",
        "answer3": "3.00 oz",
        "answer4": "4.00 oz",
        "correctanswer": "1.50 oz",
        "description": "The recipe for the French Martini contains 1.50 oz of Vodka."
    },
    {
        "id": 28, 
        "question": "How many ounces of Raspberry Liqueur are in a French Martini?",
        "answer1": "3.00 oz",
        "answer2" : "4.00 oz",
        "answer3": "1.50 oz",
        "answer4": "5.50 oz",
        "correctanswer": "1.50 oz",
        "description": "The recipe for the French Martini contains 1.50 oz of Raspberry Liqueur!"
    },
    {
        "id": 29, 
        "question": "How many ounces of Pineapple Juice are in a French Martini?",
        "answer1": "0.75 oz",
        "answer2" : "2.00 oz",
        "answer3": "1.50 oz",
        "answer4": "3.50 oz",
        "correctanswer": "0.75 oz",
        "description": "The recipe for the French Martini contains 0.75 oz of Pineapple Juice."
    },
    {
        "id": 30, 
        "question": "Using the recipe for the Classic Martini, please name the liquor and liqueur combination in this amazing drink!",
        "answer1": "Rum & Chartreuse",
        "answer2" : "Gin & Dry Vermouth",
        "answer3": "Gin & Chambord",
        "answer4": "Vodka & Chambord",
        "correctanswer": "Gin & Dry Vermouth",
        "description": "Gin & Dry Vermouth is the correct combination to make the Classic Martini. This combination has made this drink very popular!",
    },
    {
        "id": 31, 
        "question": "Using the recipe for the Espresso Martini, please name the liquor and liqueur combination in this amazing drink!",
        "answer1": "Vodka & Chambord",
        "answer2" : "Vodka & Coffee Liqueur",
        "answer3": "Rum & Chartreus",
        "answer4": "Gin & Chambord",
        "correctanswer": "Vodka & Coffee Liqueur",
        "description": "Vodka & Coffee Liqueur is the correct combination to make the Espresso Martini. This combination has made this drink very popular!",
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
    return render_template("menu.html")
    return render_template("drinks.html")

@app.route('/quiz')                                     #Quizpage
def quizPage():
    return render_template("quiz.html")

@app.route('/bartender')                                #bartenderpage
def bartenderPage():
    global pourHistory
    global graded_pour
    pourHistory = {
        "drinkName": "",
        "glassType": "",
        "mix": False,
        "shake": False,
        "addIce": False,
        "addIce2": False,
        "ingredients": {}
    }
    graded_pour = {}
    return render_template("bartender.html")

@app.route('/quizquestion/<int:id>')                            #quizquestion Page
def quizquestionPage(id):
    # print(id)
    return render_template("quizquestion.html")

@app.route('/bartendhome')                            #quizquestion Page
def bartendHome():
    return render_template("bartend-home.html")

@app.route('/quizcomplete')                            #quizquestion Page
def quizcompetePage():
    return render_template("quizcomplete.html")

#display Quiz Question
@app.route("/quizquestion/quizquestion", methods=["GET", "POST"])
def quizquestion():
    global quiz
    id = request.get_json()

    if len(random_int_set) == 5:
        random_int_set.clear()

    random_int = random.randint(1, 31) 
    if random_int not in random_int_set: 
        id = random_int
        random_int_set.add(random_int)
    
    print(random_int_set)
    quizquestion_results = []
    print("Hello hello" + str(id))  #error checking

    # find the question in the data
    for question in quiz:
        if question["id"] == int(id):
            quizquestion_results.append(question)

    # print(foodpage_results) # error checking
    # print(homepage_results) Used to check if correct data is sending back
    if len(quizquestion_results) != 0:
        return jsonify(question=quizquestion_results)
    else:
        return jsonify("Question Display Failed")


perfect_pour = {
    "French Martini": {
        "glassType": "Coupe Glass",
        "mix": False,
        "shake": True,
        "addIce": True,
        "ingredients": {
            "Vodka": 1.5,
            "Chambord": 0.5,
            "Simple Syrup": 0.5,
            "Pineapple Juice": 0.5
        }
    },
    "Espresso Martini": {
        "glassType": "Coupe Glass",
        "mix": False,
        "shake": True,
        "addIce": True,
        "ingredients": {
            "Vodka": 1.5,
            "Coffee Liqueur": 1,
            "Espresso": 1.5,
            "Simple Syrup": 0.5
        }
    },
    "Classic Martini": {
        "glassType": "Martini Glass",
        "mix": True,
        "shake": False,
        "addIce": True,
        "ingredients": {
            "Gin": 2,
            "Dry Vermouth": 0.5
        }
    },
    "Peach Bellini": {
        "glassType": "Flute Glass",
        "mix": True,
        "shake": False,
        "addIce": True,
        "ingredients": {
            "Peach Juice": 2,
            "Champagne": 3
        }
    }
}

def calc_result():
    global graded_pour
    global perfect_pour
    score = 10
    feedback = []
    if graded_pour == {}:
        return 0, ["You haven't poured anything yet! Try again!"]
    else:
        grader = perfect_pour[graded_pour["drinkName"]]
        if grader["glassType"] != graded_pour["glassType"]:
            score -= 2
            feedback.append("You used the wrong glassware! It should be a " + grader["glassType"] + "!")
        if grader["addIce"] != graded_pour["addIce"]:
            score -= 0.2
            feedback.append("Next time, always shake/mix with ice!")
        if grader["mix"] != graded_pour["mix"] and grader["mix"] == True:
            if graded_pour["shake"]:
                score -= 1
                feedback.append("This drink requires mixing, not shaking!")
            else:
                score -= 1
                feedback.append("This drink requires mixing!")
        if grader["shake"] != graded_pour["shake"] and grader["shake"] == True:
            if graded_pour["mix"]:
                score -= 1
                feedback.append("This drink requires shaking, not mixing!")
            else:
                score -= 1
                feedback.append("This drink requires shaking!")
        if graded_pour["shake"] and graded_pour["mix"]:
            score -= 1
            feedback.append("Don't double dip, choose to either shake or mix the drink - never both!")

        for ingredient, amount in grader["ingredients"].items():
            if ingredient not in graded_pour["ingredients"]:
                score -= 0.5
                feedback.append(f"You didn't include {amount} oz of {ingredient}!")
            elif graded_pour["ingredients"][ingredient] != amount:
                score -= 0.3
                feedback.append(f"You didn't include the correct amount of {ingredient}! It should be {amount} oz!")
        
        for ingredient in graded_pour["ingredients"]:
            if ingredient not in grader["ingredients"]:
                score -= 1.2
                feedback.append(f"You included {ingredient} which is not in the recipe!")

        random.shuffle(feedback)
        return score, feedback


@app.route('/bartender/result')                                    
def resultPage():
    result, feedbacks = calc_result()
    if feedbacks == []:
        feedbacks = ["Congratulations! You made a perfect pour!"]
    result = max(0, result)
    if result <= 3:
        title_text = "Ew...Dry as a Bone!"
    elif result <= 5:
        title_text = "Shakin' Things Up...Kinda!"
    elif result <= 8:
        title_text = "Cheers to that Pour!"
    else:
        title_text = "Hmmmmm...Delicious and Refreshing!"
    return render_template("result.html", result=result, feedbacks=feedbacks, title_text=title_text)

@app.route('/learning/transition', methods=['GET'])
def learning_transition():
    chosen_drink = request.args.get('drink')
    drink_endpoints = {
        'Peach Bellini': 'peach_bellini',
        'French Martini': 'french_martini',
        'Espresso Martini': 'espresso_martini',
        'Classic Martini': 'classic_martini'
    }
        
    return render_template("learning-trans.html", chosen_drink = drink_endpoints[chosen_drink], drink_name_proper = chosen_drink)

@app.route('/get-bar-items')
def get_items():
    category = request.args.get('category', default = '*', type = str)

    image_list = {
        'liquors' : ['static/images/liquors/vodka.png', 'static/images/liquors/gin.png', 'static/images/liquors/champagne.png'],
        'liqueurs' : ['static/images/liqueurs/coffee.png', 'static/images/liqueurs/chambord.png', 'static/images/liqueurs/vermouth.png'],
        'syrups': ['static/images/syrups/simple.png'],
        'juices-mixer': ['static/images/juices-mixer/espresso.png', 'static/images/juices-mixer/pineapple.png', 'static/images/juices-mixer/peach.png'],
        'glassware': ['static/images/glassware/coupe.png', 'static/images/glassware/martini.png', 'static/images/glassware/flute.png'],
        'ice': ['static/images/ice/ice.png']
    }

    return jsonify(image_list[category])

pourHistory = {
    "drinkName": "",
    "glassType": "",
    "mix": False,
    "shake": False,
    "addIce": False,
    "addIce2": False,
    "ingredients": {}
}

@app.route('/api/pour-history-ingredients', methods=['POST'])
def pour_history_ingred():
    data = request.get_json()
    for key, value in data.items():
        key = key.split('http://127.0.0.1:5000/')[1]
        print(key)
        ref_dict = {
            "static/images/liquors/gin.png": "Gin",
            "static/images/liquors/vodka.png": "Vodka",
            "static/images/liquors/champagne.png": "Champagne",
            "static/images/liqueurs/coffee.png": "Coffee Liqueur",
            "static/images/liqueurs/chambord.png": "Chambord",
            "static/images/liqueurs/vermouth.png": "Dry Vermouth",
            "static/images/syrups/simple.png": "Simple Syrup",
            "static/images/juices-mixer/espresso.png": "Espresso",
            "static/images/juices-mixer/pineapple.png": "Pineapple Juice",
            "static/images/juices-mixer/peach.png": "Peach Juice"
        }
        key = ref_dict[key]

        if key in pourHistory['ingredients']:
            pourHistory['ingredients'][key] = value
        else:
            pourHistory['ingredients'][key] = value
    with open('pourHistory.json', 'w') as f:
        json.dump(pourHistory, f)
    print(pourHistory)  # Print the pour history
    return jsonify({'message': 'Pour history received and stored.'})

@app.route('/api/pour-history-mix', methods=['POST'])
def pour_history_mix():
    pourHistory['mix'] = True
    if pourHistory["addIce2"]:
        pourHistory['addIce'] = True
    print(pourHistory)
    return jsonify({'message': 'Pour history received and stored.'})


@app.route('/api/pour-history-shake', methods=['POST'])
def pour_history_shake():
    pourHistory['shake'] = True
    if pourHistory["addIce2"]:
        pourHistory['addIce'] = True
    print(pourHistory)
    return jsonify({'message': 'Pour history received and stored.'})

@app.route('/api/pour-history-addIce', methods=['POST'])
def pour_history_addIce():
    if not pourHistory['shake'] and not pourHistory['mix']:
        pourHistory['addIce'] = True
    pourHistory['addIce2'] = True
    print(pourHistory)
    return jsonify({'message': 'Pour history received and stored.'})

graded_pour = {}

@app.route('/api/pourIntoGlass', methods=['POST'])
def pour_into_glass():
    global graded_pour
    graded_pour = pourHistory.copy()
    graded_pour.pop('addIce2', None)  # Remove the 'addIce2' key
    print(graded_pour)
    return jsonify({'message': 'Pour history received and stored.'})


@app.route('/api/glass-fetched', methods=['POST'])
def glass_fetch():
    data = request.get_json()
    imagePath = data['imagePath']

    ref_dict = {
        'http://127.0.0.1:5000/static/images/glassware/coupe.png': 'Coupe Glass',
        'http://127.0.0.1:5000/static/images/glassware/martini.png': 'Martini Glass',
        'http://127.0.0.1:5000/static/images/glassware/flute.png': 'Flute Glass'
    }

    pourHistory['glassType'] = ref_dict[imagePath]

    print(pourHistory)
    return jsonify({'message': 'Pour history received and stored.'})


@app.route('/random-drink')
def random_drinks():
    global pourHistory
    drinks = ['Classic Martini', 'French Martini', 'Peach Bellini', 'Espresso Martini']
    chosen = random.choice(drinks)
    pourHistory['drinkName'] = chosen
    return jsonify({'drink': chosen,
'TELLMEWHATTODOICANTTHINKFORMYSELF': instructions[chosen]
    
    })


@app.route('/peach_bellini')
def peach_bellini():
    return render_template("drinks.html", chosen_drink = "Peach Bellini", instructions = instructions["Peach Bellini"])

@app.route('/french_martini')
def french_martini():
    return render_template("drinks.html", chosen_drink = "French Martini", instructions = instructions["French Martini"])

@app.route('/espresso_martini')
def espresso_martini():
    return render_template("drinks.html", chosen_drink = "Espresso Martini", instructions = instructions["Espresso Martini"])

@app.route('/classic_martini')
def classic_martini():
    return render_template("drinks.html", chosen_drink = "Classic Martini", instructions = instructions["Classic Martini"])
      

if __name__ == '__main__':
    app.run(debug=True)
