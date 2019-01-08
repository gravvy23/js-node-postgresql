import {elements} from './base';
import {calculateTime} from '../views/reservationsView';
const url = "https://server-bd.eu-gb.mybluemix.net";

export const showDetails = (data, flight) => {
    var container = elements.allReservationsContent.children[1];
    var godzina_odlotu = flight.godzina.split(':').splice(0,2).join(':');
    var czas_lotu = flight.czas_lotu.split(':').splice(0,2).join(':');
    var godzina_przylotu = calculateTime(flight.czas_lotu, flight.godzina, flight.utc_diff);
    var HTML = `
    <div class="flight-info__date">${flight.data.split('T')[0]}</div>
    <div class="flight-info__header">
        <div class="flight-info__destination">
            <strong class="flight-info__destination__time">${godzina_odlotu}</strong>
            <small class="flight-info__destination__abbr">${flight.start}</small>
        </div>
        <div class="flight-info__duration">
            <span class="flight-info__duration__time">${czas_lotu}</span>
            <ul class="flight-info__duration__route"></ul>
            <span class="flight-info__duration__number">${flight.rejs}</span>
        </div>
        <div class="flight-info__origin">
            <strong class="flight-info__origin__time">${godzina_przylotu}</strong>
            <small class="flight-info__origin__abbr">${flight.cel}</small>
        </div>
    </div>
    <div class="flight-info__airports">
        <div class="flight-info__airports-origin">
            <strong>Lotnisko startowe</strong>
            <span>Kraj: </span>${data.kraj_start}</br>
            <span>Miasto: </span>${data.miasto_start}</br>
            <span>UTC: </span>${data.utc_start}</br>
            <span>X: </span>${setXcoord(data.x_start)}</br>
            <span>Y: </span>${setYcoord(data.y_start)}</br>
        </div>
        <div class="flight-info__airports-destination">
            <strong>Lotnisko docelowe</strong>
            <span>Kraj: </span>${data.kraj_cel}</br>
            <span>Miasto: </span>${data.miasto_cel}</br>
            <span>UTC: </span>${data.utc_cel}</br>
            <span>X: </span>${setXcoord(data.x_cel)}</br>
            <span>Y: </span>${setYcoord(data.y_cel)}</br>
        </div>
    </div>
    <div class="flight-info__plane">
        <strong>Samolot</strong>
        <span>Producent: </span>${data.producent}</br>
        <span>Model: </span>${data.model}</br>
        <span>Rok produkcji: </span>${data.rok_produkcji}</br>
        <span>Liczba załogi: </span>${data.l_zalogi}</br>
        <span>Liczba pasażerów: </span>${data.l_pasazerow}</br>
    </div>
    <div class="flight-info__buttons">
        <button class="flight-info__crew">
            <span>Lista załogi</span>
        </button>
        <button class="flight-info__close">
            <span>Zamknij</span>
        </button>
    </div>`;
    container.innerHTML = HTML;
    container.style.visibility = 'visible';
}

export const closeReservationInfo = () => {
    var container = elements.allReservationsContent.children[1];
    container.innerHTML = '';
    container.style.visibility = 'hidden';   
}

export const showCrew = (data) => {
    var container = elements.allReservationsContent.children[2];
    var HTML = `
    <div class="crew-info__header">
        Lista załogi tego lotu
    </div>
    <div class = "crew-info__list">
        <div class="crew-info__list__header">
            <span>IMIĘ</span>         
            <span>NAZWISKO</span>
            <span>FUNKCJA</span>
        </div>`;
    for (var i = 0; i < data.length ; ++i){
        HTML += `
        <div class="crew-info__list__element" id="${i+1}">
        <span>${data[i].imie}</span>
        <span>${data[i].nazwisko}</span>
        <span>${data[i].funkcja}</span>
        </div>`;
    }
    HTML += `
    </div>
    <div class="crew-info__buttons">
        <button class="crew-info__close">
                <span>Zamknij</span>
        </button>
    </div>`;
    container.innerHTML = HTML;
    container.style.visibility = 'visible';   
}

export const closeCrewInfo = () => {
    var container = elements.allReservationsContent.children[2];
    container.innerHTML = '';
    container.style.visibility = 'hidden';
}

const setXcoord = (coord) => {
    if (coord >= 0) {
        return coord + ' N';
    } else {
        return -coord + ' S';
    }
}

const setYcoord = (coord) => {
    if (coord >= 0) {
        return coord + ' E';
    } else {
        return -coord + ' W';
    }
}
