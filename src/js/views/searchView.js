import {elements} from './base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export const getOrigins = () => {
    fetch(`${url}/flights`)
    .then(res => res.json())
    .then(res => res.forEach( el => {
        elements.originList.insertAdjacentHTML('beforeend',
        `<li class="flight-search__panel__toggler__origins__element">
        <strong class="flight-search__panel__toggler__origins__element_name">${el.city}</strong>
        <small class="flight-search__panel__toggler__origins__element_abrr">${el.abbr}</small>
        </li>`);}))
        .catch(error => console.log(error));
};

export const getDestinations = (origin) => {
    fetch(`${url}/flights/?city=${origin}`)
    .then(res => res.json())
    .then(res => res.forEach( el => {
        elements.destinationList.insertAdjacentHTML('beforeend',
        `<li class="flight-search__panel__toggler__destinations__element" data-goto="${el.route}">
        <strong class="flight-search__panel__toggler__destinations__element_name">${el.city}</strong>
        <small class="flight-search__panel__toggler__destinations__element_abrr">${el.abbr}</small></li>`);}))
        .catch(error => console.log(error));
    elements.listPanel.style.visibility = 'visible';
};

export const clearAll = () => {
    elements.reservationContainer.innerHTML = '';
    elements.reservationContent.style.visibility = 'hidden';
    elements.searchPageContent.innerHTML = '';
    elements.searchPageContent.style.visibility = 'hidden';
    elements.searchDetailsContent.innerHTML = '';
    elements.searchDetailsContent.style.visibility = 'hidden';
    elements.seatSubmitbutton.style.visibility = 'hidden';
    elements.seatsContent.style.visibility = 'hidden';
    elements.homePageContent.style.visibility = 'visible';
    elements.allReservationsContent.innerHTML = '';
}