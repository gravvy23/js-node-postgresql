import {elements} from './base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export const showUserReservations = (user) => {
    clearView();
    elements.allReservationsContent.innerHTML = `
        <div class="user-view_container">
            <div class="user-view_header">Twoje rezerwacje</div>
            <div class="reservation__list">
                <div class="reservation__element">
                    <div class="reservation__element__header">
                        <span>NUMER LOTU</span>         
                        <span>Z - D0</span>         
                        <span>DATA</span>         
                        <span>NAZWISKO</span>         
                    </div>
                </div>
            </div>
        </div>
        <div class="reservation-info"></div>
        <div class="reservation-info__add-luggage"></div>
        <div class="reservation-info__delete-reservation"></div>
    `;
    getURList(user);
}

export const showWorkerReservations = (worker,flights) => {
    clearView();
    elements.allReservationsContent.innerHTML = `
    <div class="staff-view_container">
            <div class="staff-view_header">
                <div class="staff-view_header-name">
                    <span>Imię:</span>
                    <div class="staff-view_header-name_field">John</div>
                </div>
                <div class="staff-view_header-surname">
                    <span>Nazwisko:</span>
                    <div class="staff-view_header-name_field">Kowalski</div>
                </div>
                <span id="header-title">Twoje Rejsy</span>
            </div>
            <div class="staff-view__list">
                    <div class="staff-view__element">
                        <div class="staff-view__element__header">
                            <span>NUMER LOTU</span>         
                            <span>Z - D0</span>
                            <span>FUNKCJA</span>
                            <span>TYP SAMOLOTU</span>
                            <span>GODZINA</span>       
                            <span>DATA</span>         
                        </div>
                    </div>
            </div>
       </div>
       <div class = "flight-info"></div>
       <div class = "crew-info"></div>`;
       getSVList(worker,flights);
}

export const showDetails = (data,flightId) => {
    var container = elements.allReservationsContent.children[1];
    var HTML = 
    `<div class="reservation-info__date">${flightId}</div>
    <span class="reservation-info__passengers_title">PASAŻEROWIE</span>
    <div class="reservation-info__passengers_container">`;
    for (let i = 0; i < data.length; ++i){
        var typ = data[i].klasa;
        var typLong;
        if (typ == 'b'){
            typLong = 'Business';
        } else if (typ == 'p') {
            typLong = 'Sandard Plus';
        } else {
            typLong = 'Economy';
        }
        HTML += `
        <div class="reservation-info__passenger" id="${i+1}">
        <div class="reservation-info__passenger-1stline">
            <div class="reservation-info__passenger-name">${data[i].imie} ${data[i].nazwisko}</div>
            <span>miejsce: </span>
            <div class="reservation-info__passenger-seat">${data[i].miejsce}</div>
            <div class="reservation-info__passenger-seat-type">${typLong}</div>
        </div>
        <div class="reservation-info__luggage">
            <div class="reservation-info__luggage-el" id="1-bag">
                <strong>15kg bagaż rejestrowany</strong>
                <small>94 zł za lot</small>
                <img src="svg/baggage_small.svg" alt="search" height="40">
                <div class="reservation-info__luggage-buttons">
                        <div class="reservation-info__luggage-count">${data[i].bagaz_maly}</div>
                        <button class="res-btn-increase_lugg">
                            <img src="svg/plus-button.svg" alt="search" height="15">
                        </button>
                </div>
            </div>
            <div class="reservation-info__luggage-el" id="2-bag">
                <strong>23kg bagaż rejestrowany</strong>
                <small>103 zł za lot</small>
                <img src="svg/baggage_medium.svg" alt="search" height="40">
                <div class="reservation-info__luggage-buttons">
                        <div class="reservation-info__luggage-count">${data[i].bagaz_sredni}</div>
                        <button class="res-btn-increase_lugg">
                            <img src="svg/plus-button.svg" alt="search" height="15">
                        </button>
                </div>
            </div>
            <div class="reservation-info__luggage-el" id="3-bag">
                <strong>26kg bagaż rejestrowany</strong>
                <small>157 zł za lot</small>
                <img src="svg/baggage_big.svg" alt="search" height="40">
                <div class="reservation-info__luggage-buttons">
                        <div class="reservation-info__luggage-count">${data[i].bagaz_duzy}</div>
                        <button class="res-btn-increase_lugg">
                            <img src="svg/plus-button.svg" alt="search" height="15">
                        </button>
                </div>
            </div>
        </div>
    </div>`;
    }
    HTML += `<div class="reservation-info__add-luggage-buttons">
    <button class="reservation-info__remove">
        <span>Anuluj rezerwację</span>
    </button>
    <button class="reservation-info__close">
        <span>Zamknij</span>
    </button>
    </div></div>`;
    container.innerHTML = HTML;
    container.style.visibility = 'visible';
}

export const closeReservationInfo = () => {
    var container = elements.allReservationsContent.children[1];
    container.innerHTML = '';
    container.style.visibility = 'hidden';
}

export const showAddLugWindow = (id) => {
    var container = elements.allReservationsContent.children[2];
    container.style.visibility = 'visible';
    var price;
    switch (id){
        case 1:
            price = 94;
            break;
        case 2:
            price = 103;
            break;
        case 3:
            price = 157;
            break;
    }
    container.innerHTML = `
    <span>Czy chesz dodać bagaż?</br>do zapłaty: </span>
    <div class="reservation-info__add-luggage-price">${price}zł</div>
    <div class="reservation-info__add-luggage-buttons">
        <button class="reservation-info__add-luggage-cancel">
            <span>Anuluj</span>
        </button>
        <button class="reservation-info__add-luggage-submit">
            <span>Kup</span>
        </button>
    </div>`;
}

export const closeLuggageWindow = () => {
    var container = elements.allReservationsContent.children[2];
    container.style.visibility = 'hidden';
}

const clearView = () =>{
    if (elements.reservationContent.style.visibility == 'visible'){
        elements.reservationContainer.innerHTML = '';
        elements.reservationContent.style.visibility = 'hidden';
    } else if (elements.searchPageContent.style.visibility == 'visible'){
        elements.searchPageContent.style.visibility = 'hidden';
        elements.searchDetailsContent.style.visibility = 'hidden';
        elements.peopleContent.innerHTML = '';
    } else if (elements.seatsContent.style.visibility == 'visible'){
        elements.seatsContent.style.visibility = 'hidden';
    } else {
        elements.homePageContent.style.visibility = 'hidden';
    }
    elements.allReservationsContent.style.visibility = 'visible';
}

const getURList = (user) => {
    fetch(`${url}/users/${user}`)
    .then(res => res.json())
    .then(res => {
        for (let i = 0; i < res.length; ++i){
            var container = elements.allReservationsContent.children[0].children[1].children[0];
            var godzina_odlotu = res[i].godzina.split(':').splice(0,2).join(':');
            var godzina_przylotu = calculateTime(res[i].czas_lotu, res[i].godzina, res[i].utc_diff);
            container.insertAdjacentHTML('beforeend',
            `<div class="reservation__element__content" id="${i+1}">
                <div class="reservation__element__content__fn">${res[i].rejs}</div>
                <div class="reservation__element__content__route">${res[i].start} - ${res[i].cel}</div>
                <div class="reservation__element__content__date">
                    <strong>${res[i].data.split('T')[0]}</strong>
                    <small>${godzina_odlotu}-${godzina_przylotu}</small></div>
                <div class="reservation__element__content__name">${res[i].nazwisko}</div>
            </div>`);
        }
        
    })
        .catch(error => console.log(error));
}

const getSVList = (worker,flights) => {
    fetch(`${url}/staff/${worker}`)
    .then(res => res.json())
    .then(res => {
        flights.addFlights(res);
        var staffInfo = elements.allReservationsContent.children[0].children[0];
        staffInfo.children[0].children[1].innerHTML = res[0].imie;
        staffInfo.children[1].children[1].innerHTML = res[0].nazwisko;
        var container = elements.allReservationsContent.children[0].children[1].children[0];
        for (let i = 0; i < res.length; ++i){
            var godzina_odlotu = res[i].godzina.split(':').splice(0,2).join(':');
            container.insertAdjacentHTML('beforeend',
            `<div class="staff-view__element__content" id="${i+1}">
            <div class="staff-view__element__content__fn">${res[i].rejs}</div>
            <div class="staff-view__element__content__route">${res[i].start} - ${res[i].cel}</div>
            <div class="staff-view__element__content__distance">${res[i].funkcja}</div>
            <div class="staff-view__element__content__type">${res[i].typ_samolotu}</div>
            <div class="staff-view__element__content__time">${godzina_odlotu}</div>
            <div class="staff-view__element__content__date">${res[i].data.split('T')[0]}</div>
            </div>`);
        }
        
    })
        .catch(error => console.log(error));
}


export const calculateTime = (czas_lotu, godzina, utc_diff) => {
    var czas = czas_lotu.split(':');
    var godzina = godzina.split(':').splice(0,2).join(':');
    var godzina_przylotu = new Date(new Date(0,0,0,godzina.split(':')[0],godzina.split(':')[1]).getTime() + (60*parseInt(czas[0])+parseInt(czas[1]) + 60*utc_diff)*60000);
    var minuty = godzina_przylotu.getMinutes().toString();
    if (minuty.length == 1) minuty = '0' + minuty;
    godzina_przylotu = [godzina_przylotu.getHours(),minuty].join(':');
    return godzina_przylotu;
}


