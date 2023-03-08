const currentDate = new Date();
const currentDay = currentDate.getDate();
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentMonthNum = currentDate.getMonth() + 1;
const currentMonth = months[currentMonthNum - 1];
let nextMonth;
let nextMonthNum
if (currentDate.getMonth() + 1 < 12) {
    nextMonth = months[currentDate.getMonth() + 1];
    nextMonthNum = currentMonthNum + 1;
} else {
    nextMonth = months[0];
    nextMonthNum = 1;
}
const currentYear = currentDate.getFullYear();
const currentCards = document.createDocumentFragment();
const imagesFolderPath = '../resources/images/';
const nextCards = document.createDocumentFragment();
let currentMonthTitle = document.createElement('h1');
currentMonthTitle.setAttribute('class', 'month');
currentMonthTitle.innerHTML = currentMonth;
let nextMonthTitle = document.createElement('h1');
nextMonthTitle.setAttribute('class', 'month');
nextMonthTitle.innerHTML = nextMonth;

const getEvents = async () => {
    try {
        const response = await fetch('../data/events.json');
        if (response.ok) {
            const jsonEvents = await response.json()
            const currentEvents = jsonEvents.filter(event => {
                if (event.year === currentYear && event.month === currentMonthNum && event.endDay >= currentDay) {
                    return true;
                }
            });
            const nextEvents = jsonEvents.filter(event => {
                if (event.year >= currentYear && event.month === nextMonthNum) {
                    return true;
                }
            })
            return [currentEvents, nextEvents];
        }
    }
    catch(error) {
        alert(error);
    }
}
function displayEvents() {
    getEvents().then(events => {
        const currentEvents = events[0];
        const nextEvents = events[1];
        currentEvents.forEach(event => {
            let eventCard = makeCard(event);
            currentCards.appendChild(eventCard);
        });
        nextEvents.forEach(event => {
            let eventCard = makeCard(event);
            nextCards.appendChild(eventCard);
        });
        document.querySelector('#events').appendChild(currentMonthTitle);
        if (currentEvents.length === 0) {
            let noEvents = document.createElement('h1');
            noEvents.setAttribute('class', 'no-events');
            noEvents.innerHTML = 'No events at the moment';
            document.querySelector('#events').appendChild(noEvents);
        } else {
            document.querySelector('#events').appendChild(currentCards);
        }
        document.querySelector('#events').appendChild(nextMonthTitle);
        if (nextEvents.length === 0) {
            let noEvents = document.createElement('h1');
            noEvents.setAttribute('class', 'no-events');
            noEvents.innerHTML = 'No events at the moment';
            document.querySelector('#events').appendChild(noEvents);
        } else {
            document.querySelector('#events').appendChild(nextCards);
        }
    })
}

function makeCard(event) {
    let dates;
    if (event.startDay != event.endDay) {
        dates = `${event.startDay}-${event.endDay}`;
    } else {
        dates = event.startDay;
    }
    let eventCard = document.createElement('div');
    eventCard.setAttribute('class', 'event-card');
    let imageContainer = document.createElement('div');
    imageContainer.setAttribute('class', 'image-container');
    eventCard.appendChild(imageContainer);
    let image = document.createElement('img');
    image.setAttribute('class', 'event-image');
    image.setAttribute('src', `${imagesFolderPath + event.image}`);
    imageContainer.appendChild(image);
    let eventInfo = document.createElement('section');
    eventInfo.setAttribute('class', 'event-info');
    eventCard.appendChild(eventInfo);
    let eventTitle = document.createElement('h2');
    eventTitle.setAttribute('class', 'event-title');
    eventTitle.innerHTML = `${months[event.month - 1].slice(0, 3)} ${dates}: ${event.title}`;
    eventInfo.appendChild(eventTitle);
    let eventDescription = document.createElement('p');
    eventDescription.setAttribute('class', 'event-description');
    eventDescription.innerHTML = event.description;
    eventInfo.appendChild(eventDescription);
    return eventCard;
}
displayEvents();