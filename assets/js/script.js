const APIKey = '607f916d5e35cb2ff44c2fc0e4c26499';
const baseURL = 'https://api.openweathermap.org/data/2.5/forecast';

const submitBtn = document.querySelector('#submit-btn');


// function to call to localStorage and append values from the key pastSearch
function renderUserInput() {
    let userInput = JSON.parse(localStorage.getItem('pastSearch'));
    let searchList = document.getElementById('past-search');

    if (userInput !== null) {
        searchList.textContent = '';

        function appendSearch() {
            for (let i = 0; i<userInput.length; i++) {
                let pastSearch = userInput[i];
                let searchItem = document.createElement('p');
                searchItem.textContent = pastSearch;
                searchList.appendChild(searchItem);
            };
        };

        appendSearch();
    };
};

// event listener for page load
document.addEventListener('DOMContentLoaded', function () {
    renderUserInput();
//event listener for submittion button
    document.getElementById('submit-btn').addEventListener('click', function (event) {
        event.preventDefault();

        let search = document.getElementById('search-input').value;
        // display data based on user input
        getWeatherData(search);
        //trim search input and save to local storage. also renders it afterwards
        if (search.trim() !== '') {
            let userInput = JSON.parse(localStorage.getItem('pastSearch')) || [];
            userInput.push(search);
            localStorage.setItem('pastSearch', JSON.stringify(userInput));
            renderUserInput();
        } else {
            console.error('You need to enter a city name.');
            return;
        }
    });
});
// helper function for displaying temperature in fahrenheit to 2 decimals
function convertTemp(kelvin) {
    const celsius = kelvin - 273.15;
    const fahrenheit = (celsius * 9/5) + 32;
    return fahrenheit.toFixed(2);
}
// function for getting weather from api
let getWeatherData = function(cityName) {
    let apiUrl = baseURL + '?q=' + cityName + '&appid=' + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.statusText);
            }
        })
        // function for creating and appending weather cards
        .then(function (data) {

            let weatherCardsContainer = document.getElementById('card-container');
            weatherCardsContainer.innerHTML = '';

            for (let index = 0; index < data.list.length; index++) {
                const element = data.list[index];

                if (element.dt_txt.endsWith('12:00:00')) {
                    const forecastDate = element.dt_txt.split(' ')[0];
                    const tempKelvin = element.main.temp;
                    const tempFahrenheit = convertTemp(tempKelvin);
                    const wind = element.wind.speed;
                    const humidity = element.main.humidity;
                    const icon = element.weather[0].icon;

                    let card = document.createElement('div');
                    card.classList.add('card');

                    let iconImg = document.createElement('img');
                    iconImg.src = `https://openweathermap.org/img/wn/${icon}.png`;
                    iconImg.alt = 'Weather Icon';

                    card.innerHTML = `
                        <h3><span class="date">${forecastDate}</span></h3>
                        <p>Temperature: <span class="temperature">${tempFahrenheit} </span>°F</p>
                        <p>Wind: <span class="wind">${wind} MPH</span></p>
                        <p>Humidity: <span class="humidity">${humidity} %</span></p>`;

                    card.appendChild(iconImg);
                    weatherCardsContainer.appendChild(card);
                }
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather: ' + error.message);
        });
};