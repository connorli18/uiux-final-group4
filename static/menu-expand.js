window.onload = function() {
    fetch('/random-drink')
        .then(response => response.json())
        .then(data => {
            var overlayText = document.querySelector('.overlay-text');
            if (overlayText) {
                overlayText.innerText = data.drink;
            }
        })
        .catch(error => console.error('Error:', error));
};

document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    let lastClickedCategory = null;
    let box = null;

    categories.forEach(category => {
        category.addEventListener('click', function() {
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
                box.style.right ='420px';
                box.style.width = '700px';
                box.style.height = '150px';
                box.style.backgroundColor = 'transparent';
                box.style.zIndex = '1000';
                box.style.border = '2px solid black';
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
                        // Create a new img element for each item and append it to the box
                        items.forEach(item => {
                            const itemElement = document.createElement('img');
                            itemElement.src = item;

                            // Apply some styles to the item element
                            itemElement.style.marginRight = '20px';
                            itemElement.style.marginLeft = '100px';
                            itemElement.style.marginTop = '10px';
                            itemElement.style.marginBottom = '10px';
                            itemElement.style.padding = '10px';
                            itemElement.style.width = 'auto';  // Change this to make each item take up 1/3 of the box
                            itemElement.style.objectFit = 'scale-down';  // Change this to keep the aspect ratio of the images
                            itemElement.style.height = 'auto';

                            // Add an event listener to the item element that changes the image source of the coaster-two div when clicked
                            // But only if the item is a glassware
                            if (this.id === 'glassware') {
                                itemElement.addEventListener('click', function() {
                                    const coasterImg = document.querySelector('.coaster-two img');
                                    const coasterText = document.querySelector('.text-coaster');
                                    if (coasterImg) {
                                        coasterImg.src = item;
                                        coasterImg.style.width = 'auto';  // Set the width of the image
                                        coasterImg.style.height = '150px';  // Set the height of the image
                                        coasterImg.style.objectFit = 'contain';  // Ensure that the aspect ratio of the image is maintained
                                        coasterText.style.marginTop = '30px';
                                    }
                                });
                            }

                            box.appendChild(itemElement);
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