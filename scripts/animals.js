const animalsSection = document.querySelector('.animals');
const searchBar = document.querySelector('.search-bar');
const animalsList = document.querySelector('#animals-list');
const searchForm = document.querySelector('#animal-search');
let searchResults = document.querySelector('#search-results');
const animalsToAdd = document.createDocumentFragment();
let jsonAnimals;
let animalResults;
const getAnimals = async () => {
    try {
        const response = await fetch('../data/animals.json');
        if (response.ok) {
            jsonAnimals = await response.json();
        }
    }
    catch(error) {
        alert(error);
    }
}
// Function to show list of all animals. Not for search.
function displayAnimals() {
    getAnimals().then(() => {
        jsonAnimals.forEach(animal => {
                let listAnimal = document.createElement('li');
                listAnimal.setAttribute('class', 'animal-list-item');
                listAnimal.innerHTML = animal.name;
                animalsToAdd.appendChild(listAnimal);
            })
        animalsList.appendChild(animalsToAdd);
    });
}

function handleResults(newResults, oldResults, docFragList) {
    if (typeof oldResults == 'undefined') {
        newResults.forEach(result => {
            let listResult = document.createElement('li');
            if (result.name === 'not found') {
                listResult.setAttribute('class', 'no-search-list-item');
            } else {
                listResult.setAttribute('class', 'search-list-item');
            }
            listResult.innerHTML = result.name;
            searchResults.appendChild(listResult);
        })
    } else if (newResults.length != oldResults.length || newResults[0].name != oldResults[0].name) {
        newResults.forEach(result => {
            let listResult = document.createElement('li');
            if (result.name === 'not found') {
                listResult.setAttribute('class', 'no-search-list-item');
            } else {
                listResult.setAttribute('class', 'search-list-item');
            }
            listResult.innerHTML = result.name;
            docFragList.appendChild(listResult);
        })
        searchResults = document.querySelector('#search-results');
        //replace old results with new list
        animalsSection.replaceChild(docFragList, searchResults);
        //give new list id of old list
        animalsSection.children[1].setAttribute('id', 'search-results');
    }
}
// Take search input and update list of results for animals that match the input as it's typed
searchBar.addEventListener('input', (event) => {
    let inputValue = event.target.value.toLowerCase();
    let animalResultsOld = animalResults;
    let inputLength = inputValue.length;
    if (inputLength >= 1) {
        animalResults = jsonAnimals.filter(animal => {
            let animalName = animal.name.toLowerCase();
            if (animalName.slice(0, inputLength) === inputValue || animalName.includes(' ' + inputValue) || animalName.includes('/' + inputValue)) {
                return true;
            }
        });
        let docFrag = document.createDocumentFragment();
        let newSearchList = document.createElement('ul');
        docFrag.appendChild(newSearchList);
        handleResults(animalResults, animalResultsOld, newSearchList);
    }
    if (inputValue === '') {
        for (let element of document.querySelectorAll('.search-list-item')) {
            element.remove();
            animalResults = [];
        }
    }
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let inputValue = searchBar.value.toLowerCase();
    let animalResultsOld = animalResults;
    console.log(inputValue);
    let inputLength = inputValue.length;
    if (inputLength >= 1) {
        animalResults = jsonAnimals.filter(animal => {
            let animalName = animal.name.toLowerCase();
            if (animalName.slice(0, inputLength) === inputValue || animalName.includes(' ' + inputValue) || animalName.includes('/' + inputValue)) {
                return true;
            }
        });
        if (animalResults.length === 0) {
            animalResults = [{name: "not found"}];
        }
        let docFrag = document.createDocumentFragment();
        let newSearchList = document.createElement('ul');
        docFrag.appendChild(newSearchList);
        handleResults(animalResults, animalResultsOld, newSearchList);
    }
    if (inputValue === '') {
        for (let element of document.querySelectorAll('.search-list-item')) {
            element.remove();
            animalResults = [];
        }
    }
})

displayAnimals();
