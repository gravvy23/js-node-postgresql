import Search from './models/Search';
import Calendar from './models/Calendar';
import Seats from './models/Seats';
import Reservations from './models/Reservations';
import Flights from './models/Flights';
import {elements} from './views/base';
import * as searchView from './views/searchView';
import * as calendarView from './views/calendarView';
import * as seatsView from './views/seatsView';
import * as reservationsView from './views/reservationsView';
import * as flghtsView from './views/flightsView';
const url = "https://server-bd.eu-gb.mybluemix.net";

const search = new Search();
const seats = new Seats();
const reservation = new Reservations();
const flights = new Flights();
let calendar;
//obsluga przyciskow na pasku nawigacji
elements.navigationButtonSignup.addEventListener('click', e => {
    elements.signUpForm.style.visibility = "visible";
});
elements.navigationButtonLogin.addEventListener('click', e => {
    elements.logInForm.style.visibility = "visible";
});
elements.navigationButtonLoginWorker.addEventListener('click', e => {
    elements.logInWorkerForm.style.visibility = "visible";
});
elements.navigationButtonLogout.addEventListener('click', e=>{
    search.userId = null;
    elements.navigationButtonSignup.style.visibility = "visible";
    elements.navigationButtonLogin.style.visibility = "visible";
    elements.navigationButtonLoginWorker.style.visibility = "visible";
    elements.navigationButtonLogout.style.visibility = "hidden";
    elements.navigationButtonMyFlights.style.visibility = "hidden";
    window.location.hash = 'home';
})
elements.navigationButtonLogoutWorker.addEventListener('click', e=>{
    search.workerId = null;
    elements.navigationButtonSignup.style.visibility = "visible";
    elements.navigationButtonLogin.style.visibility = "visible";
    elements.navigationButtonLoginWorker.style.visibility = "visible";
    elements.navigationButtonLogoutWorker.style.visibility = "hidden";
    elements.navigationButtonMyFlights.style.visibility = "hidden";
    window.location.hash = 'home';
})
elements.logInSubmit.addEventListener('click', e=>{
    var temp_login, temp_passwd, el;
    el = e.target.parentElement.childNodes;
    for (var i = 0; i < el.length; i++){
        if (el[i].id == "pole1"){
            temp_login = el[i].value;
        }
        if (el[i].id == "pole2"){
            temp_passwd = el[i].value;
        }
    }
    var data = {
    	login: temp_login,
    	passwd: temp_passwd
    }
    fetch(`${url}/login`, {
    	method: 'POST', 
  		body: JSON.stringify(data), 
  		headers:{
		    'Content-Type': 'application/json'
		  }
    })
    	.then(res => res.json())
    	.then(res => {
    		if (res == -1){
    			alert("Zły login lub hasło, spróbuj ponownie");
    		} else {
                search.userId = res;
                elements.navigationButtonSignup.style.visibility = "hidden";
                elements.navigationButtonLogin.style.visibility = "hidden";
                elements.navigationButtonLoginWorker.style.visibility = "hidden";
                elements.navigationButtonLogout.style.visibility = "visible";
                elements.navigationButtonMyFlights.style.visibility = "visible";
    		}
    	})
    	.catch(error => console.log(error));
    elements.logInForm.style.visibility = "hidden";
});
elements.logInWorkerSubmit.addEventListener('click',e =>{
    var temp_login, temp_passwd, el;
    el = e.target.parentElement.childNodes;
    for (var i = 0; i < el.length; i++){
        if (el[i].id == "pole1_worker"){
            temp_login = el[i].value;
        }
        if (el[i].id == "pole2_worker"){
            temp_passwd = el[i].value;
        }
    }
    var data = {
    	login: temp_login,
    	passwd: temp_passwd
    }
    fetch(`${url}/login_worker`, {
    	method: 'POST', 
  		body: JSON.stringify(data), 
  		headers:{
		    'Content-Type': 'application/json'
		  }
    })
    	.then(res => res.json())
    	.then(res => {
    		if (res == -1){
    			alert("Zły login lub hasło, spróbuj ponownie");
    		} else {
                search.workerId = res;
                elements.navigationButtonSignup.style.visibility = "hidden";
                elements.navigationButtonLogin.style.visibility = "hidden";
                elements.navigationButtonLoginWorker.style.visibility = "hidden";
                elements.navigationButtonLogoutWorker.style.visibility = "visible";
                elements.navigationButtonMyFlights.style.visibility = "visible";
    		}
    	})
        .catch(error => console.log(error));
    elements.logInWorkerForm.style.visibility = "hidden";
});
elements.signUpSubmit.addEventListener('click',e =>{
    var tmp_imie, tmp_nazwisko, tmp_data_urodzenia, tmp_narodowosc, tmp_login, tmp_passwd, tmp_nr_dokumnetu, el;
    el = e.target.parentElement.childNodes;
    for (var i = 0; i < el.length; i++){
        if (el[i].id == "pole1_signup"){
            tmp_imie = el[i].value;
        }
        if (el[i].id == "pole2_signup"){
            tmp_nazwisko = el[i].value;
        }
        if (el[i].id == "pole3_signup"){
            tmp_data_urodzenia = el[i].value;
        }
        if (el[i].id == "pole4_signup"){
            tmp_narodowosc = el[i].value;
        }
        if (el[i].id == "pole5_signup"){
            tmp_login = el[i].value;
        }
        if (el[i].id == "pole6_signup"){
            tmp_passwd = el[i].value;
        }
        if (el[i].id == "pole7_signup"){
            if (el[i].value.length != 10) alert("zły numer dokumentu");
            else tmp_nr_dokumnetu = el[i].value;
        }
    }
    if (tmp_login && tmp_passwd && tmp_imie && tmp_nazwisko && tmp_data_urodzenia && tmp_narodowosc && tmp_nr_dokumnetu) {
        var data = {
            login: tmp_login,
            passwd: tmp_passwd,
            imie: tmp_imie,
            nazwisko: tmp_nazwisko,
            data_urodzenia: tmp_data_urodzenia,
            narodowosc: tmp_narodowosc,
            nr_dokumentu: tmp_nr_dokumnetu
        }
        fetch(`${url}/users?login=${data.login}`)
            .then(res => res.json())
            .then(res => {
            	console.log(res.login);
            	if(res.login == false){
					fetch(`${url}/users`, {
			            method: 'POST', 
			            body: JSON.stringify(data), 
			            headers:{
			                'Content-Type': 'application/json'
			            }
			        })
			            .then(res => res.json())
			            .then(res => {
			                console.log(res);
			                if (res.status == "ERROR"){
			                    alert("błąd połączenia z bazą danych, spróbuj ponownie później");
			                } else if (res.status == "OK"){
			                    alert("Utworzono nowe konto użytkownika");
			                }
			            })
			            .catch(error => console.log(error));
			        elements.signUpForm.style.visibility = "hidden";
            	} else {
            		alert("Podana nazwa użytkownika już istnieje!");
            	}
            })
            .catch(error => console.log(error));

        
    }
    else {
        alert("Wypełnij wszystkie pola");
    }
});
//obsluga panelu wyboru lotu
//przycisk roziwjający listę lotnisk z których odbywane są loty
elements.originListButton.addEventListener('click', e => {
    if (elements.listPanel.style.visibility == 'visible') {
        elements.listPanel.style.visibility = 'hidden';
        elements.originList.innerHTML = '';
        elements.destinationList.innerHTML = '';
    } else {
        searchView.getOrigins();
        elements.listPanel.style.visibility = 'visible';
    }
})
//nacisniecie lotniska startowego i docelowego
elements.searchPanel.addEventListener('click', e=>{
    //lotnisko startowe
    const airport = e.target.closest('.flight-search__panel__toggler__origins__element');
    if (airport){
        search.addOrigin(airport);
        elements.listPanel.style.visibility = 'hidden';
        elements.originList.innerHTML = '';
    }

    //lotnisko docelowe
    const destination = e.target.closest('.flight-search__panel__toggler__destinations__element');
    if (destination){
        search.addDestination(destination);
        elements.listPanel.style.visibility = 'hidden';
        elements.destinationList.innerHTML = '';
    }
})
//przycisk roziwjający listę lotnisk do których są loty z danego lotniska
elements.destinationListButton.addEventListener('click', e=>{
    if (elements.listPanel.style.visibility == 'visible' && elements.originList.innerHTML == '') {
        elements.listPanel.style.visibility = 'hidden';
        elements.destinationList.innerHTML = '';
    } else if (search.flightSearch.origin) {
        elements.originList.innerHTML = '';
       searchView.getDestinations(search.flightSearch.origin);
    }
})
//przycisk dodający osoby w rezerwacji
elements.increasePeopleButton.addEventListener('click', e => {
    let number = elements.numberOfPeople.innerHTML;
    elements.numberOfPeople.innerHTML = parseInt(number) + 1;
})
//przycisk usuwajacy osoby z rezerwacji
elements.decreasePeopleButton.addEventListener('click', e => {
    let number = parseInt(elements.numberOfPeople.innerHTML);
    if (number > 1){
        elements.numberOfPeople.innerHTML = number-1;
    }
})
//przycisk wysyłający formularz wyszukiwania
elements.searchSubmitButton.addEventListener('click', e => {
    const isFilled = search.checkForm();
    if (isFilled){
        window.location.hash = '';
        elements.homePageContent.style.visibility = 'hidden';
        calendar = new Calendar(search.flightSearch.month, search.flightSearch.year);
        calendar.searchResults(search.flightSearch.route);
        seats.setPeople(search.flightSearch.numberOfPeople);
    }
})
//klikniecie na wybrana date
elements.searchPageContent.addEventListener('click', e => {
    var day = e.target.closest('.day');
    if (day && !day.classList.contains('invalid')){
        search.getDataInfo(day);
        calendarView.showDetails(search.flightSearch.numberOfPeople, search.date);
    }
})
//klikniecie na przycisk kontynuuj 
elements.searchDetailsContent.addEventListener('click',e => {
    var contButton = e.target.closest('.details_container__submit');
    if (contButton){
        seatsView.showSeats(search.flightSearch.numberOfPeople,
            search.date.flight);
    }
})
//wybór miejsca przez uzytkownika
Array.from(elements.seatButtons).forEach( seat => {
    seat.addEventListener('click', e => {
        var currentSeat = e.target.closest('.seat');
        var svgName = currentSeat.children[0].src;
        svgName = svgName.split('/');
        svgName = svgName[svgName.length-1];
        if (svgName != "seat_occupied.svg") {
            var id = currentSeat.id.split('-')[1];
            id = parseInt(id);
            if (svgName != "seat_selected.svg" && seats.selected < seats.whole) {
                currentSeat.children[0].src = "svg/seat_selected.svg";
               seats.addSeat(id,search.date.minPrice);
            }
            else if (svgName == "seat_selected.svg") {
                seats.deleteSeat(id);
                if (parseInt(currentSeat.id.split('-')[1]) > 6){
                    currentSeat.children[0].src = "svg/seat_free.svg";
                } else {
                    currentSeat.children[0].src = "svg/seat_premium.svg";
                }
            }
            if (seats.selected == seats.whole){
                elements.seatSubmitbutton.style.visibility = 'visible';
            }
        }
    })
})
//nacisniecie przycisku rezerwuj na widoku rezerwacji miejsc
elements.seatSubmitbutton.addEventListener('click', e => {
    if (search.userId){
        for (var i = 0 ; i < search.flightSearch.numberOfPeople; ++i){
            search.reservation[i].uzytkownik = search.userId;
            var seat = seats.getSeat(i);
            search.reservation[i].miejsce = seat.seat;
            search.reservation[i].cena = seat.price;
        }
        elements.seatSubmitbutton.style.visibility = 'hidden';
        elements.seatsContent.style.visibility = 'hidden';
        Array.from(elements.seatButtons).forEach( seat => {
            seat.children[0].src = "svg/seat_occupied.svg";
        });
        elements.peopleContent.innerHTML = '';
        seatsView.showReservationForm(search.reservation);
        elements.reservationContent.style.visibility = 'visible';

    } else {
        alert("Musisz być zalogowany aby przejść do dalszej części rezerwacji!");
    }
})
//adding/deleting Luggage
elements.reservationContainer.addEventListener('click', e=>{
    var decrease = e.target.closest('.btn-decrease_lugg');
    if (decrease){
        var feedback = seatsView.decreaseLug(decrease);
        if (feedback) search.deleteLug(feedback);
    }
    var increase = e.target.closest('.btn-increase_lugg');
    if (increase) {
        var feedback = seatsView.addLug(increase);
        search.addLug(feedback);
    }
})
//submit reservation
elements.reservationSubmit.addEventListener('click', e=>{
    var data = seatsView.getDatafromReservtionForm(search.flightSearch.numberOfPeople);
    if (seatsView.checkData(data)){
        search.fillReservation(data);
        search.performReservation();
        calendar = null;
        seats.clearData();
        searchView.clearAll();
    } else {
        alert("Wypełnij wszystkie pola poprawnie!");
    }
})
//przejscie do strony z moimi lotami
elements.navigationButtonMyFlights.addEventListener('click', e=>{
    //user
    if (search.userId){
        reservationsView.showUserReservations(search.userId);
        calendar = null;
        seats.clearData();
        search.clearData();
        window.location.hash = '';
    //staff
    } else if (search.workerId){
        reservationsView.showWorkerReservations(search.workerId,flights);
        window.location.hash = '';
    }
});

//show details of user flight
elements.allReservationsContent.addEventListener('click', e => {
    var element = e.target.closest('.reservation__element__content');
    if (element){
        var flightId = element.children[0].innerHTML;
        reservation.addFlight(flightId);
        reservation.getReservationInfo(search.userId);
    }
    var closeButton = e.target.closest('.reservation-info__close');
    if (closeButton){
        reservationsView.closeReservationInfo();
    }
    var cancelButton = e.target.closest('.reservation-info__remove');
    if (cancelButton){
        reservation.deleteReservation( search.userId);
    }
    var addLuggage = e.target.closest('.res-btn-increase_lugg');
    if (addLuggage){
        var lugId = addLuggage.closest('.reservation-info__luggage-el').id.split('-')[0];
        reservationsView.showAddLugWindow(parseInt(lugId));
        reservation.luggageId = parseInt(lugId);
        reservation.addPlace(addLuggage);
    }

    var cancelAddLuggage = e.target.closest('.reservation-info__add-luggage-cancel');
    if (cancelAddLuggage){
        reservationsView.closeLuggageWindow();
        reservation.placeId = null;
        reservation.luggageId = null;
        reservation.luggage = null;
    }

    var submitAddLuggage = e.target.closest('.reservation-info__add-luggage-submit');
    if (submitAddLuggage){
        console.log('click');
        reservation.submitLuggage(search.userId);
        reservationsView.closeLuggageWindow();
    }

    //staff

    var staffElement = e.target.closest('.staff-view__element__content');
    if (staffElement){
        var flightId = staffElement.children[0].innerHTML;
        flights.addFlight(flightId);
        flights.getFlightInfo(search.workerId);
    }

    var closeStaffButton = e.target.closest('.flight-info__close');
    if (closeStaffButton){
        flghtsView.closeReservationInfo();
    }

    var crewButton = e.target.closest('.flight-info__crew');
    if (crewButton){
        flights.getCrew();
    }

    var crewCloseButton = e.target.closest('.crew-info__close');
    if (crewCloseButton) {
        flghtsView.closeCrewInfo();
    }
})

//nacisniecie na ikone linii lotniczej lub wylogowanie sie
//zmiana hasha na #home
window.addEventListener('hashchange',e => {
    const extend = window.location.hash.replace('#','');
    if (extend == 'home'){
        calendar = null;
        seats.clearData();
        searchView.clearAll();
        reservation.clearData();
        flights.clearData();
    }
})
//renderowanie strony startowej, pobranie listy miast z których odbywane są loty
// ['hashchange','load'].forEach(event => window.addEventListener(event,() => {
//     const extend = window.location.hash.replace('#','');
//     if (extend == '') console.log('start');
//     fetch(`${url}/flights`)
//             .then(res => res.json())
//             .then(res => res.forEach( el => {
//                 elements.originList.insertAdjacentHTML('beforeend',
//                 `<li class="flight-search__panel__toggler__origins__element">
//                 <strong class="flight-search__panel__toggler__origins__element_name">${el.city}</strong>
//                 <small class="flight-search__panel__toggler__origins__element_abrr">${el.abbr}</small>
//                 </li>`);}))
//             .catch(error => console.log(error));
// }));