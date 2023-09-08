import debounce from 'lodash.debounce';

const input = document.getElementById('country-input');
const countryList = document.getElementById('country-list');
const countryDetails = document.getElementById('country-details');
const alertsContainer = document.getElementById('alerts-container');

const API_URL = 'https://restcountries.com/v2/name';

// Функція для відображення сповіщень за допомогою Bootstrap Alert
function showAlert(message, type) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alertElement.setAttribute('role', 'alert');
    
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрити"></button>
    `;
    
    alertsContainer.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.remove();
    }, 5000); // Закрити сповіщення автоматично через 5 секунд
}

// Функція для відображення даних про країну
function renderCountryDetails(country) {
    countryDetails.innerHTML = `
        <h2>${country.name}</h2>
        <p><strong>Столиця:</strong> ${country.capital}</p>
        <p><strong>Населення:</strong> ${country.population}</p>
        <p><strong>Мови:</strong> ${country.languages.map((lang) => lang.name).join(', ')}</p>
        <img src="${country.flags[0]}" alt="Прапор ${country.name}" width="100">
    `;
}

// Функція для відображення списку країн
function renderCountryList(countries) {
    countryList.innerHTML = '';
    countries.forEach((country) => {
        const listItem = document.createElement('li');
        listItem.textContent = country.name;
        listItem.addEventListener('click', () => {
            renderCountryDetails(country);
        });
        countryList.appendChild(listItem);
    });
}

// Функція для виконання HTTP-запиту з використанням debounce
const searchCountry = debounce(async (query) => {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API_URL}/${query}`);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const countries = JSON.parse(xhr.responseText);
                if (countries.length === 1) {
                    renderCountryDetails(countries[0]);
                } else if (countries.length > 10) {
                    showAlert('Будь ласка, зробіть запит більш специфічним.', 'warning');
                } else {
                    renderCountryList(countries);
                }
            } else {
                showAlert('Помилка при отриманні даних про країни.', 'danger');
            }
        };
        xhr.send();
    } catch (error) {
        showAlert('Помилка при виконанні запиту.', 'danger');
    }
}, 500);

// Обробник події input для пошуку країн
input.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.trim() !== '') {
        searchCountry(query);
    } else {
        countryList.innerHTML = '';
        countryDetails.innerHTML = '';
    }
});



