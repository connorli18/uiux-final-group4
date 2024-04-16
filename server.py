from flask import Flask
from flask import render_template 
from flask import Response, request, jsonify
import random
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


@app.route('/get-bar-items')
def get_items():
    category = request.args.get('category', default = '*', type = str)

    image_list = {
        'liquors' : ['static/images/liquors/vodka.png', 'static/images/liquors/gin.png', 'static/images/liquors/champagne.png'],
        'liqueurs' : ['static/images/liqueurs/coffee.png', 'static/images/liqueurs/chambord.png', 'static/images/liqueurs/triplesec.png'],
        'syrups': ['static/images/syrups/simple.png'],
        'juices-mixer': ['static/images/juices-mixer/espresso.png', 'static/images/juices-mixer/pineapple.png', 'static/images/juices-mixer/peach.png'],
        'glassware': ['static/images/glassware/coupe.png', 'static/images/glassware/martini.png', 'static/images/glassware/flute.png'],
    }

    return jsonify(image_list[category])


@app.route('/random-drink')
def random_drinks():
    drinks = ['Classic Martini', 'French Martini', 'Peach Bellini', 'Espresso Martini']
    return jsonify({'drink': random.choice(drinks)})

if __name__ == '__main__':
    app.run(debug=True)
