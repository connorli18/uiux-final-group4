
instructions = {
    'Classic Martini': [  #????
        # Glassware
        [
            "Prepare a chilled martini glass for serving.",1
        ],
        # Liquors
        [
            "For liquor, choose gin.",
            "Measure 2 oz (60 ml) of gin.", 1
        ],
        # Liqueurs
        ["No need to add any liqueurs.", -1],
        # Syrups
        ["Do not add any syrups as this is a classic martini.", -1],
        # Juices/Mixers
        ["It's usually garnished with a twist of lemon or an olive, no need for any juice or mixers", -1],
        #
        [
    "Add ice to the cocktail shaker.",
    "Mix the ingredients with a mixer",
    "Pour the cocktail into the chilled glass.",
    "Serve and enjoy, you will be headed to the Home page on click!"
]
    #classic: [1][1] => box[1]
    ],

    'French Martini': [
        # Glassware
        [ #coupe glass
            "Prepare a chilled coupe glass for serving.",0
        ],
        # Liquors
        [
            "For liquor, choose vodka.",
            "Measure 1 1/2 oz (45 ml) of vodka.", 0
        ],
        # Liqueurs
        [#0.5 oz
            "For liqueur, choose raspberry liqueur (such as Chambord).",
            "Measure 1/2 oz (15 ml) of raspberry liqueur.",1
        ],
        # Syrups
        [#no syrups
            "Optional, but you can add some syrup if you like.",
            "If that's the case, don't go over 1/2 oz (15 ml)!", 0
        ],
        # Juices/Mixers
        [
            "Pineapple juice is a popular choice for this cocktail.", 
            "Add 1/2 oz (15 ml) of pineapple juice.",1 
        ],
         [
    "Add ice to the cocktail shaker.",
    "Shake the ingredients inside the shaker",
    "Pour the cocktail into the chilled glass.",
    "Serve and enjoy, you will be headed to the Home page on click!"
]

        #French: [1][1] => box[1]; [2][1] => box[2]; [3][1] => box[3]; [4][1] => box[4]
    ],

    'Peach Bellini': [
        # Glassware
        [ 
            "Prepare a chilled champagne flute for serving.",2
        ],
        # Liquors
        ["Choose champagne as the main ingredient for the bellini",
        "Add around 3 oz for best taste", 2],
        # Liqueurs
        [
            "Peach Bellini is a simple drink, don't overcomplicate it with liqueurs.",-1
            # "For liqueur, choose peach liqueur (such as De Kuyper).",
            # "Measure 1/2 oz (15 ml) of peach liqueur.",2
        ],
        # Syrups
        [  #: 0 syrup
            "Don't add any syrups to this cocktail.", -1
            # "You can choose peach purée or your favorite syrup",
            # "Add 2 oz (60 ml) of syrup", 0
        ],
        # Juices/Mixers:  2 oz
        ["Juice: you could add some tropical (ideally peach) juice.",
        "Add around 2 oz (15 ml) of juice", 2],
         [
    "Add ice to the cocktail shaker.",
    "Mix the ingredients with a mixer",
    "Pour the cocktail into the chilled glass.",
    "Serve and enjoy, you will be headed to the Home page on click!"
]
        # 
       #> [2][1] => box[1]; [3][1] => box[2]; [4][1] => box[3]
       #new box: [1[1]=> box1, [4][1] => box 2
    ],

    'Espresso Martini': [
        # Glassware
        [# wrong => coupe 
            "Prepare a chilled coupe glass for serving.",0
        ],
        # Liquors
        [ #1.5  oz
            "For liquor, choose vodka.",
            "Measure 1.5 oz (30 ml) of vodka.", 0
        ],  
        # espresso: [1][1] => box[0+1];   [2][1] => box[1+1] 
        # Liqueurs
        [
            "For liqueur, choose coffee liqueur (such as Kahlúa).",
            "Measure 1 oz (30 ml) of coffee liqueur.", 0
        ],
        # Syrups: 0.5
        [   "You can add some syrup to sweeten the drink.",
            "Put 0.5 oz of syrups in this classy cocktail.", 0],
        # Juices/Mixers
        [  #1.5 oz
            "Brew a shot of espresso and let it cool to room temperature.", "1.5 oz is the recommended range", 0
        ],
         [
    "Add ice to the cocktail shaker.",
    "Shake the ingredients inside the shaker",
    "Pour the cocktail into the chilled glass.",
    "Serve and enjoy, you will be headed to the Home page on click!"
]
    ]
}

#care: 
# 1) what ingredient is chosen : position in box when chosen (measure_map on browser); what's possible to click on (last idx in instructions)
# 2) how much of ingred: oz on counter func in js (volumemap)

#limitations:
#if add sth => always 2 instruction since the click automatically move you to next step
# refactor idea: pouring is a step in it own , not even hard since next button is already trigger when pour full


#next step: