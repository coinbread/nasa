const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API 

const count = 5;
const apiKey = 'QnUV5v7dwpBRE3DvMKJwmTuqDbS1l1tPeojxhvPa'; //My personal API key for 1000 request
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
    
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

    console.log('curr Array', page, currentArray);
    currentArray.forEach((res) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        //link
        const link = document.createElement('a');
        link.href = res.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = res.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = res.title;
        // save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = "Add To Favorites";
            saveText.setAttribute('onclick', `saveFavorite('${res.url}')`);
        } else {
            saveText.textContent = "Remove Favorite";
            saveText.setAttribute('onclick', `removeFavorite('${res.url}')`);
        }
        
        // Card text
        const cardText = document.createElement('p');
        cardText.textContent = res.explanation;
        //Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = res.date;
        // Copyright
        const copyrightResult = (typeof res.copyright === 'undefined') ? '' : res.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        //Append
        footer.append(date,copyright);
        cardBody.append(cardTitle, saveText, cardText,  footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    //Get favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        // console.log('favorites', favorites);
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        updateDOM('favorites');
    } catch (error) {
        // catch error here
        console.log('some error',error);
    }
}

// Add results to favorites
function saveFavorite(itemUrl) {
    // console.log('res.url', itemUrl);
    //Loop Through res Array to select Favorite

    resultsArray.forEach((item) => {
        if ( item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            // Show Save Confirmation 2 sec
            saveConfirmed.classList.remove('hidden');
            setTimeout(() => {
                saveConfirmed.classList.add('hidden');
            }, 2000);
            // Set favorites in localstorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

// Remove results from favorites
function removeFavorite(itemUrl) {
    // console.log('res.url', itemUrl);
    //Loop Through res Array to select Favorite

    if( favorites[itemUrl]) {
        delete favorites[itemUrl];
        //Update favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites')
    }
}
getNasaPictures();