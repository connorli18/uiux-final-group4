window.onload = function () {
    fetch('/random-drink')
        .then(response => response.json())
        .then(data => {
            var overlayText = document.querySelector('.overlay-text');
            if (overlayText) {
                overlayText.innerText = data.drink;
            }
        })
        .catch(error => console.error('Error:', error));

    displayTimer();
};

let box = null;
let draggedItem = null;
let glasspicked = false;

document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelectorAll('.category');
    let lastClickedCategory = null;
    let nextBoxIndex = 0;  // To keep track of the box where the next item should be placed

    categories.forEach(category => {
        category.addEventListener('click', function () {
            // If the box exists and the last clicked category is the same as the current one, remove the box
            if (box && lastClickedCategory === this) {
                box.remove();
                box = null;
                lastClickedCategory.classList.remove('active');  // Remove the 'active' class from the last clicked category
                lastClickedCategory = null;
            } else {
                // If the box exists, remove it before creating a new one
                if (box) {
                    box.remove();
                }

                if (lastClickedCategory) {
                    lastClickedCategory.classList.remove('active');  // Remove the 'active' class from the last clicked category
                }

                // Add the 'active' class to the currently clicked category
                this.classList.add('active');

                // Create a new div element
                box = document.createElement('div');

                // Set the box's style properties
                box.style.position = 'absolute';
                box.style.top = '130px';
                box.style.right = '480px';
                box.style.width = '600px';
                box.style.height = '150px';
                box.style.backgroundColor = 'transparent';
                box.style.zIndex = '1000';
                box.style.border = '2px solid lightgrey';
                box.style.display = 'flex';
                box.style.justifyContent = 'flex-start';
                box.style.overflowX = 'auto';

                // Append the box to the body of the document
                document.body.appendChild(box);

                // Fetch the items for the clicked category from the server
                fetch(`/get-bar-items?category=${this.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(items => {

                        let lastClickedItems = [null, null, null, null];  // To store the last clicked items

                        // Create a new img element for each item and append it to the box
                        items.forEach(item => {
                            const figureElement = document.createElement('figure');
                            const itemElement = document.createElement('img');
                            const captionElement = document.createElement('figcaption');

                            let imgName = item.split('/').pop();
                            itemElement.src = item;
                            itemElement.title = imgName;

                            let dictionary = {
                                "vodka.png" : "Vodka",
                                "gin.png" : "Gin",
                                "champagne.png" : "Champagne",
                                "coffee.png" : "Coffee Liqueur",
                                "chambord.png" : "Chambord",
                                "triplesec.png" : "Triple Sec",
                                "simple.png" : "Simple Syrup",
                                "espresso.png" : "Espresso",
                                "pineapple.png" : "Pineapple Juice",
                                "peach.png" : "Peach Juice",
                                "coupe.png" : "Coupe Glass",
                                "martini.png" : "Martini Glass",
                                "flute.png" : "Flute Glass",
                                "vermouth.png" : "Vermouth"
                            };

                            let displayName = dictionary[imgName];
                            captionElement.innerText = displayName ? displayName : imgName;
                            captionElement.style.textAlign = 'center';
                            captionElement.style.paddingLeft = '20px';
                            captionElement.style.paddingTop = '10px';

                            // Apply some styles to the item element
                            itemElement.style.marginRight = '20px';
                            itemElement.style.marginLeft = '45px';
                            itemElement.style.marginTop = '10px';
                            itemElement.style.marginBottom = '0px';
                            itemElement.style.padding = '0px';
                            itemElement.style.width = 'auto';  // Change this to make each item take up 1/3 of the box
                            itemElement.style.objectFit = 'scale-down';  // Change this to keep the aspect ratio of the images
                            itemElement.style.height = '90px';

                            figureElement.appendChild(itemElement);
                            figureElement.appendChild(captionElement);
                            figureElement.style.display = 'flex';
                            figureElement.style.flexDirection = 'column';
                            figureElement.style.alignItems = 'center';
                            figureElement.style.marginRight = '20px';
                            figureElement.style.marginLeft = '20px';

                            // Add an event listener to the item element that changes the image source of the coaster-two div when clicked
                            // But only if the item is a glassware

                            let categoryId = this.id;

                            itemElement.addEventListener('click', function () {
                                if (categoryId !== 'glassware') {

                                    // Find the first boxElement that has a placeholder image
                                    let placeholderBoxIndex = -1;
                                    for (let i = 1; i <= 4; i++) {
                                        const boxElement = document.querySelector(`.box${i}`);
                                        const imgElement = boxElement.querySelector('img');
                                        if (imgElement.src === "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") {
                                            placeholderBoxIndex = i - 1;
                                            break;
                                        }
                                    }

                                    // If there is no box with a placeholder image, don't add the new image
                                    if (placeholderBoxIndex === -1) {
                                        return;
                                    }

                                    // Add the item to the last clicked items and update the image of the corresponding box
                                    lastClickedItems[placeholderBoxIndex] = item;
                                    const boxElement = document.querySelector(`.box${placeholderBoxIndex + 1}`);
                                    if (boxElement) {
                                        const imgElement = boxElement.querySelector('img');
                                        if (imgElement) {
                                            imgElement.src = item;
                                            imgElement.style.objectFit = 'contain';  // Set the width of the image
                                            imgElement.style.height = '90%';
                                            imgElement.style.width = '90%';  // Set the height of the image

                                            imgElement.draggable = true;  // Make the item draggable

                                            imgElement.addEventListener('dragstart', function (event) {
                                                event.dataTransfer.setData('text/plain', item);
                                                event.dataTransfer.setData('text/elementId', imgElement.id);  // Store the id of the imgElement
                                            });

                                            boxElement.style.position = 'relative';


                                            const pourButton = document.createElement('button');
                                            pourButton.style.fontSize = '20px';
                                            pourButton.textContent = 'Pour';
                                            pourButton.style.display = 'none';  // Hide the button by default
                                            pourButton.style.position = 'absolute';  // Position the button absolutely
                                            pourButton.style.top = '80%';  // Center the button vertically
                                            pourButton.style.left = '50%';  // Center the button horizontally
                                            pourButton.style.transform = 'translate(-50%, -50%)';  // Ensure the button is centered
                                            boxElement.appendChild(pourButton);

                                            // Placeholder image source
                                            const placeholderSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

                                            // Show the "pour" button when the image is hovered over
                                            boxElement.addEventListener('mouseover', function () {
                                                if (imgElement.src == placeholderSrc) {
                                                    pourButton.style.display = 'none';
                                                }
                                                else {
                                                    pourButton.style.display = 'block';
                                                }
                                            });

                                            // Hide the "pour" button when the mouse leaves the image
                                            boxElement.addEventListener('mouseout', function () {
                                                pourButton.style.display = 'none';
                                            });


                                            let pouringImage;
                                            let pouringInterval;
                                            let rotation = 0;
                                            let isPouring = false;
                                            let isPouringInProgress = false;
                                            let count = 0;  // Add a variable to keep track of the count
                                            let countInterval;  // Add a variable to keep track of the interval that updates the count
                                            let countElement;  // Add a variable to keep track of the element that displays the count
                                            let pourHistory = {};  // Create an object to store the pour history

                                            // Start pouring when the "Pour" button is pressed down
                                            pourButton.addEventListener('mousedown', function () {
                                                if (isPouring || isPouringInProgress) return;
                                                isPouring = true;
                                                isPouringInProgress = true;

                                                // Create a new image element
                                                pouringImage = document.createElement('img');
                                                pouringImage.src = imgElement.src;
                                                pouringImage.style.position = 'fixed';
                                                pouringImage.style.top = '50%';
                                                pouringImage.style.left = '56%';
                                                pouringImage.style.width = 'auto';
                                                pouringImage.style.height = '15%';
                                                pouringImage.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                                                pouringImage.style.zIndex = '1001';

                                                // Append the new image to the body of the document
                                                document.body.appendChild(pouringImage);

                                                // Create a new element to display the count
                                                countElement = document.createElement('div');
                                                countElement.style.position = 'fixed';
                                                countElement.style.top = '45%';
                                                countElement.style.left = '60%';
                                                countElement.style.zIndex = '1002';  // Make sure the count is above everything else
                                                countElement.style.textAlign = 'center';
                                                countElement.style.fontSize = '16px';  // Adjust this value to change the size of the count
                                                countElement.textContent = '0 oz';


                                                // Add these lines to make the element a circle with a light grey background
                                                countElement.style.width = '100px';  // Adjust this value to change the size of the circle
                                                countElement.style.height = '50px';  // Adjust this value to change the size of the circle
                                                countElement.style.backgroundColor = 'lightgrey';
                                                countElement.style.borderRadius = '50%';  // This makes the element a circle
                                                countElement.style.display = 'flex';
                                                countElement.style.justifyContent = 'center';
                                                countElement.style.alignItems = 'center';

                                                // Append the count to the body of the document
                                                document.body.appendChild(countElement);

                                                // Start rotating the image
                                                pouringInterval = setInterval(function () {
                                                    if (rotation < 150) {
                                                        rotation += 75;
                                                    } else {
                                                        rotation += 0;
                                                    }
                                                    pouringImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                                                }, 100);

                                                // Start updating the count
                                                countInterval = setInterval(function () {
                                                    count += 0.25;  // Increase the count by 0.25 every second
                                                    countElement.textContent = `${count.toFixed(2)} oz`;  // Update the count element with the new count
                                                    if (pouringImage.src in pourHistory) {
                                                        pourHistory[pouringImage.src] += 0.25;
                                                    } else {
                                                        pourHistory[pouringImage.src] = 0.25;
                                                    }
                                                }, 400);  // Update the count every second
                                            });

                                            // Stop pouring when the mouse button is released, regardless of where the mouse is
                                            window.addEventListener('mouseup', stopPouring);

                                            function stopPouring() {
                                                if (!isPouring) return;
                                                isPouring = false;

                                                if (pouringInterval) {
                                                    clearInterval(pouringInterval);
                                                    pouringInterval = setInterval(function () {
                                                        if (rotation > 0) {
                                                            rotation -= 30;
                                                            pouringImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
                                                        } else {
                                                            clearInterval(pouringInterval);
                                                            pouringImage.remove();
                                                            isPouringInProgress = false;
                                                        }
                                                    }, 100);
                                                }

                                                // Stop updating the count and remove the count element when the mouse button is released
                                                if (countInterval) {
                                                    clearInterval(countInterval);
                                                    countElement.remove();
                                                    count = 0;  // Reset the count

                                                    // Send the pour history to a server
                                                    fetch('/api/pour-history-ingredients', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify(pourHistory)
                                                    }).then(response => {
                                                        if (!response.ok) {
                                                            throw new Error('Network response was not ok');
                                                        }
                                                        return response.json();
                                                    }).then(data => {
                                                        console.log('Success:', data);
                                                    }).catch(error => {
                                                        console.error('Error:', error);
                                                    });
                                                }
                                            }

                                        }
                                    }
                                } else {
                                    const coasterImg = document.querySelector('.coaster-two img');
                                    const coasterText = document.querySelector('.text-coaster');
                                    if (coasterImg) {
                                        coasterImg.src = item;
                                        coasterImg.style.width = 'auto';  // Set the width of the image
                                        coasterImg.style.height = '200px';  // Set the height of the image
                                        coasterImg.style.contain = 'scale-down';  // Keep the aspect ratio of the image
                                        coasterImg.style.paddingBottom = '50px';
                                        glasspicked = true;

                                        // Send a signal to the server
                                        fetch('/api/glass-fetched', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({glassPicked: glasspicked, imagePath: coasterImg.src})
                                        }).then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        }).then(data => {
                                            console.log('Success:', data);
                                        }).catch(error => {
                                            console.error('Error:', error);
                                        });

                                    }
                                }
                            });

                            box.appendChild(figureElement);
                        });
                    })
                    .catch(e => {
                        console.log('There was a problem with the fetch operation: ' + e.message);
                    });

                // Update the last clicked category
                lastClickedCategory = this;
            }
        });
    });
});


// Trash Can Drag and Drop
const trashcan = document.querySelector('#trashcan');

if (trashcan) {
    trashcan.addEventListener('dragenter', function (event) {
        // Change the background color to light red when something is dragged over the trashcan
        trashcan.style.backgroundColor = 'lightcoral';
    });

    trashcan.addEventListener('dragleave', function (event) {
        // Check if the relatedTarget is a child of the trashcan
        if (!trashcan.contains(event.relatedTarget)) {
            // Change the background color back when the dragged item leaves the trashcan
            trashcan.style.backgroundColor = '';
        }
    });

    trashcan.addEventListener('dragover', function (event) {
        event.preventDefault();  // This is necessary to allow a drop
    });

    trashcan.addEventListener('drop', function (event) {
        event.preventDefault();

        // Get the id of the dragged image element
        const elementId = event.dataTransfer.getData('text/elementId');

        // Find the image element with the given id and replace it with the placeholder
        const itemElement = document.getElementById(elementId);
        if (itemElement) {
            itemElement.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            itemElement.alt = "Placeholder";

            // Get the parent boxElement of the itemElement
            const boxElement = itemElement.parentElement;
            if (boxElement) {
                // Mark the boxElement as trashed
                boxElement.dataset.trashed = "true";
            }
        }

        // Change the background color back when the item is dropped
        trashcan.style.backgroundColor = '';
    });
}


//Shaker and Mixing Animation
let shakerImage = document.querySelector('.shaker-two img');
let mixButton = document.querySelector('.mix-button');
let isMixing = false;
let mixInterval;
let shakeButton = document.querySelector('.shake-button');
let iceButton = document.querySelector('.add-ice');



mixButton.addEventListener('click', function () {

    mixButton.style.display = 'none';
    shakeButton.style.display = 'none';
    iceButton.style.display = 'none';


    if (isMixing) return;
    isMixing = true;
    let shakerDiv = document.querySelector('.shaker-two');
    shakerDiv.style.backgroundColor = 'transparent';

    shakerImage.style.zIndex = '2';

    // Create the spoon image
    let spoonImage = document.createElement('img');
    spoonImage.src = 'static/images/barspoon.png';
    spoonImage.style.position = 'absolute';
    spoonImage.style.top = '-94%';
    spoonImage.style.right = '-10%';
    spoonImage.style.zIndex = '0'; // Lower z-index means it will be behind



    // Add the spoon image to the shaker div
    shakerDiv.appendChild(spoonImage);

    // Animate the spoon image
    let rotation = 100;
    let radius = 10; // The radius of the circle
    let offsetX = 30;
    mixInterval = setInterval(function () {
        rotation += 10;
        let x = radius * Math.cos(rotation * Math.PI / 180) + offsetX;
        let y = radius * Math.sin(rotation * Math.PI / 180);
        spoonImage.style.transform = `translate(${x}px, ${y}px)`;
    }, 30);

    // Remove the spoon image after 3 seconds
    setTimeout(function () {
        isMixing = false;
        clearInterval(mixInterval);
        spoonImage.remove();
        mixButton.style.display = '';
        shakeButton.style.display = '';
        iceButton.style.display = '';
        shakerImage.style.display = '';
        shakerImage.style.zIndex = '0';
    }, 3000);
    
    // Send a signal to the server
    fetch('/api/pour-history-mix', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mix: true})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });

});





// Listen for click events on the shake button
shakeButton.addEventListener('click', function () {
    // Hide the old shaker image and the buttons
    shakerImage.style.display = 'none';
    mixButton.style.display = 'none';
    shakeButton.style.display = 'none';
    iceButton.style.display = 'none';

    // Create a new image element
    let shakingImage = document.createElement('img');
    shakingImage.src = 'static/images/shaking-tin.png';
    shakingImage.style.position = 'absolute';
    shakingImage.style.left = '58%';
    shakingImage.style.top = '64%';
    shakingImage.style.transform = 'translate(-50%, -50%)';
    shakingImage.style.height = '175px';
    shakingImage.style.width = 'auto';
    document.body.appendChild(shakingImage);

    // Animate the new image
    let shakeInterval = setInterval(function () {
        // Move the image back and forth by changing the x-coordinate
        let x = 40 * Math.sin(Date.now() / 100);
        // Rotate the image back and forth by changing the rotation angle
        let rotation = 10 * Math.sin(Date.now() / 100);
        shakingImage.style.transform = `translate(-50%, -50%) translateY(${x}px) rotate(${rotation}deg)`;
    }, 20);

    // Remove the new image and show the old image and the buttons again after 3 seconds
    setTimeout(function () {
        clearInterval(shakeInterval);
        document.body.removeChild(shakingImage);
        shakerImage.style.display = '';
        mixButton.style.display = '';
        shakeButton.style.display = '';
        iceButton.style.display = '';
    }, 3000);


    fetch('/api/pour-history-shake', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mix: true})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });
});


//Ice
iceButton.addEventListener('click', function () {
    mixButton.style.display = 'none';
    shakeButton.style.display = 'none';
    iceButton.style.display = 'none';

    // Create a new image element
    let iceImage = document.createElement('img');
    iceImage.src = 'static/images/ice/ice.png';
    iceImage.style.position = 'absolute';
    iceImage.style.left = '58%';
    iceImage.style.top = '40%';
    iceImage.style.transform = 'translate(-50%, -50%)';
    iceImage.style.height = '120px';
    iceImage.style.width = 'auto';
    iceImage.style.zIndex = '1'; // Lower z-index means it will be behind
    shakerImage.style.zIndex = '2'; // Lower z-index means it will be behind

    document.body.appendChild(iceImage);

    // Define the animation
    let animation = `
        @keyframes iceAnimation {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, 150%) scale(0); }
        }
    `;

    // Add the animation to the document
    let styleSheet = document.createElement('style');
    styleSheet.textContent = animation;
    document.head.appendChild(styleSheet);

    // Apply the animation to the ice image
    iceImage.style.animation = 'iceAnimation 1s ease-in-out';

    // Repeat the animation 2-3 times
    let repeatCount = 0;
    iceImage.addEventListener('animationend', function () {
        if (repeatCount < 2) {
            iceImage.style.animation = 'none';
            setTimeout(function () {
                iceImage.style.animation = 'iceAnimation 1s ease-in-out';
            }, 0);
            repeatCount++;
        } else {
            iceImage.remove();
            mixButton.style.display = '';
            shakeButton.style.display = '';
            iceButton.style.display = '';
            shakerImage.style.zIndex = '0';
        }
    });


    fetch('/api/pour-history-addIce', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mix: true})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });
});


// Variables for rotation and intervals
let rotation = 0;
let pouringInterval;
let uprightInterval;

// Create the "Pour into Glass" button
let pourIntoGlassButton = document.createElement('button');
pourIntoGlassButton.textContent = 'Pour Into Glass';
pourIntoGlassButton.classList.add('pour-into-glass');
pourIntoGlassButton.style.position = 'absolute';
pourIntoGlassButton.style.top = '50%';
pourIntoGlassButton.style.left = '50%';
pourIntoGlassButton.style.transform = 'translate(-50%, -50%)';
pourIntoGlassButton.style.display = 'none';

// Add the button to the shaker
let shakerTwo = document.querySelector('.shaker-two');
shakerTwo.style.position = 'relative';
shakerTwo.appendChild(pourIntoGlassButton);

// Show the button when you hover over the shaker
shakerTwo.addEventListener('mouseover', function () {
    // Replace 'glassSelected' with the actual condition that checks if the glass is selected
    if (glasspicked) {
        pourIntoGlassButton.style.display = 'block';
    }
});

// Hide the button when you stop hovering over the shaker
shakerTwo.addEventListener('mouseout', function () {
    pourIntoGlassButton.style.display = 'none';
});

let pouring = false;
let shakerImagecopy = document.createElement('img');

// Create a new shaker image
shakerImagecopy.src = 'static/images/shaker.png';
shakerImagecopy.style.position = 'absolute';
shakerImagecopy.style.top = '50%';
shakerImagecopy.style.left = '45%';
shakerImagecopy.style.transform = 'translate(-50%, -50%) rotate(0deg)';
shakerImagecopy.style.zIndex = '1001';
shakerImagecopy.style.height = '180px';
shakerImagecopy.style.display = 'none'; // Hide the image initially

// Add the image to the body
document.body.appendChild(shakerImagecopy);

// Add an event listener to the "Pour Into Glass" button
pourIntoGlassButton.addEventListener('mousedown', function () {
    // Check if an animation is already running
    if (pouring) {
        return;
    }

    pouring = true;

    // Hide the other buttons
    mixButton.style.display = 'none';
    shakeButton.style.display = 'none';
    iceButton.style.display = 'none';

    // Get the image element from the coaster-two div
    let imageElement = document.querySelector('.coaster-two img');

    // Get the image path from the src attribute
    let imagePath = imageElement.src;

    // Split the path to get the image name
    let imagePathParts = imagePath.split('/');

    // Get the image name without the extension
    let imageName = imagePathParts[imagePathParts.length - 1].split('.')[0];

    // Add an 'f' in front of the image name
    let newImageName = 'f' + imageName;

    // Replace the image name in the path
    imagePathParts[imagePathParts.length - 1] = newImageName + '.png';

    // Join the parts back together to form the new path
    let newImagePath = imagePathParts.join('/');

    // Change the src of the image in the coaster-two div
    imageElement.src = newImagePath;

    // Show the shaker image
    shakerImagecopy.style.display = '';

    glasspicked = false;

    // Start rotating the image
    pouringInterval = setInterval(function () {
        if (rotation < 150) {
            rotation += 50; // Increase rotation speed over time
        }
        shakerImagecopy.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;
    }, 100);

    fetch('/api/pourIntoGlass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pour: true})
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });
});

// Stop pouring when the mouse button is released or leaves the button
pourIntoGlassButton.addEventListener('mouseleave', endPour);

function endPour() {
    if (!pouring) {
        return;
    }

    clearInterval(pouringInterval);

    // Start rotating the image back to the upright position
    uprightInterval = setInterval(function () {
        if (rotation > 0) {
            rotation -= 50; // Decrease rotation over time
        }
        shakerImagecopy.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;

        // Stop the animation when the shaker is upright
        if (rotation <= 0) {
            clearInterval(uprightInterval);
            shakerImagecopy.style.display = 'none'; // Hide the image
            mixButton.style.display = '';
            shakeButton.style.display = '';
            iceButton.style.display = '';
            pouring = false;
            shakerImage.style.display = '';
            shakerImage.style.zIndex = '0';
        }
    }, 100);
}

let seconds = 0;
let minutes = 0;

function displayTimer() {
    seconds++;
    if (seconds >= 60) {
        minutes++;
        seconds = 0;
    }
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let time = formattedMinutes + ':' + formattedSeconds;
    document.getElementById('clock').innerText = time;
    setTimeout(displayTimer, 1000);
}


// JavaScript
document.querySelector('.serving-button').addEventListener('click', function () {
    window.location.href = '/bartender/result';
});


