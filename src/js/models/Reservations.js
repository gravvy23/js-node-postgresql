import {elements} from '../views/base';
import * as view from '../views/reservationsView';
const url = "https://server-bd.eu-gb.mybluemix.net";

export default class Reservations{
    constructor(){
        this.flightId = null;
        this.luggageId = null;
        this.placeId = null;
        this.luggage = null;
    }

    addFlight(flightid){
        this.flightId = flightid;
    }

    addPlace(target){
        var place = target.closest('.reservation-info__luggage').previousSibling.previousSibling.children[2].innerHTML;
        this.placeId = parseInt(place);
        this.luggage = target.previousSibling.previousSibling;
    }

    getReservationInfo(userId){
        fetch(`${url}/users/${userId}/flights/${this.flightId}`)
        .then(res => res.json())
        .then(res => {
            view.showDetails(res,this.flightId);
        })
        .catch(error => console.log(error));
    }

    deleteReservation(userId){
        fetch(`${url}/users/${userId}/flights/${this.flightId}`, {
            method: 'delete'
          })
          .then(response => response.json())
          .then(res => {
              this.flightId = null;
              this.placeId = null;
              this.luggageId = null;
              view.closeReservationInfo();
          })
          .then(res => {
            elements.navigationButtonMyFlights.click();
          })
          .catch(error => console.log(error));
    }

    submitLuggage(userId){
        let data = {
            miejsce: this.placeId,
            typ:     this.luggageId
        };
        fetch(`${url}/users/${userId}/flights/${this.flightId}`, {
            method: 'POST', 
              body: JSON.stringify(data), 
              headers:{
                'Content-Type': 'application/json'
              }
        })
        .then(res => res.json())
        .then(res => {
            if (res.status != 'OK') {
                alert("Błąd połączenia z serwerem :( spróbuj poźniej");
            } else {
                this.luggage.innerHTML = parseInt(this.luggage.innerHTML) + 1;
            }
            this.placeId = null;
            this.luggageId = null;
            this.luggage = null;
        })
        .catch(error => console.log(error));
    }

    clearData(){
        this.flightId = null;
        this.luggageId = null;
        this.placeId = null;
        this.luggage = null;       
    }
}