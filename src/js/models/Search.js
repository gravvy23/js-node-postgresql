import {elements} from '../views/base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export default class Search{
    constructor() {
        this.userId = null;
        this.workerId = null;
        this.flightSearch = {
            origin: null,
            destination: null,
            route: null,
            month: null,
            year: null,
            numberOfPeople: null
        };
        this.date = {
            flight: null,
            minPrice: null,
        }
        this.reservation = null;
    }

    addOrigin(airport) {
        var city = airport.querySelector('.flight-search__panel__toggler__origins__element_name').innerText;
        var abbr = airport.querySelector('.flight-search__panel__toggler__origins__element_abrr').innerText;
        elements.listPanelOrigin.value = `${city} (${abbr})`;
        elements.listPanelDestination.value = ``;
        this.flightSearch.origin = abbr;
        this.flightSearch.destination = null;
    }
    
    addDestination(airport) {
        var city = airport.querySelector('.flight-search__panel__toggler__destinations__element_name').innerText;
        var abbr = airport.querySelector('.flight-search__panel__toggler__destinations__element_abrr').innerText;
        elements.listPanelDestination.value = `${city} (${abbr})`;
        this.flightSearch.destination = abbr;
        this.flightSearch.route = parseInt(airport.dataset.goto);
    }

    checkForm() {
        if (!this.flightSearch.origin){
            elements.originListButton.click();
            return false;
        } else if (!this.flightSearch.destination){
            elements.destinationListButton.click();
            return false;
        } else {
            this.flightSearch.month = parseInt(elements.monthSearchList.value);
            this.flightSearch.year = parseInt(elements.yearSearchList.value);
            this.flightSearch.numberOfPeople = parseInt(elements.numberOfPeople.innerHTML);
            this.reservation = [];
            for (var i = 0; i < this.flightSearch.numberOfPeople; ++i){
                this.reservation.push({
                    uzytkownik: null,
                    miejsce: null,
                    cena: null,
                    imie: null,
                    nazwisko: null,
                    data_urodzenia: null,
                    narodowosc: null,
                    luggage: [0,0,0]
                })
            }
            return true;
        }
    }

    getDataInfo(day) {
        this.date.flight = day.dataset.goto;
        this.date.minPrice = day.children[1].innerHTML.split('z')[0];
    }

    addLug(data){
        this.reservation[data.personId].luggage[data.luggId]++;
    }

    deleteLug(data){
        this.reservation[data.personId].luggage[data.luggId]--;
    }

    fillReservation(data){
        for (var i = 0; i < data.length; ++i){
            this.reservation[i].imie =          data[i].name;
            this.reservation[i].nazwisko =      data[i].surname;
            this.reservation[i].data_urodzenia =data[i].bday;
            this.reservation[i].narodowosc =    data[i].nation;
        }
    }

    performReservation(){
        for (let i = 0; i < this.reservation.length; ++i){
            let data = {
                uzytkownik: this.reservation[i].uzytkownik,
                miejsce: this.reservation[i].miejsce,
                imie: this.reservation[i].imie,
                nazwisko: this.reservation[i].nazwisko,
                data_urodzenia: this.reservation[i].data_urodzenia,
                narodowosc: this.reservation[i].narodowosc
            };
            fetch(`${url}/flights/${this.date.flight}`, {
                method: 'POST', 
                  body: JSON.stringify(data), 
                  headers:{
                    'Content-Type': 'application/json'
                  }
            })
                .then(res => res.json())
                .then(res => {
                    if (res[0].uc14){
                        for (let j = 0; j < this.reservation[i].luggage.length; ++j){
                            if (this.reservation[i].luggage[j] != 0){
                                for (let k = 0; k < this.reservation[i].luggage[j]; ++k){
                                    let data2 = {
                                        miejsce: data.miejsce,
                                        typ:     j+1
                                    };
                                    fetch(`${url}/users/${data.uzytkownik}/flights/${this.date.flight}`, {
                                        method: 'POST', 
                                          body: JSON.stringify(data2), 
                                          headers:{
                                            'Content-Type': 'application/json'                           }
                                    })
                                    .then(res => res.json())
                                    .then(res => {
                                        if (res.status != 'OK') {
                                            alert("Błąd połączenia z serwerem :( spróbuj poźniej");
                                        }
                                    })
                                    .catch(error => console.log(error)); 
                                }
                            }
                        }
                    } else {
                        alert("Błąd połączenia z serwerem :( spróbuj poźniej");
                    }
                })
                .then(res => {
                    if (i == this.reservation.length -1){
                        this.clearData();
                    }
                })
                .catch(error => console.log(error)); 
        }
    }

    clearData(){
        this.flightSearch = {
            origin: null,
            destination: null,
            route: null,
            month: null,
            year: null,
            numberOfPeople: null
        };
        this.date = {
            flight: null,
            minPrice: null,
        }
        this.reservation = null;
    }
}