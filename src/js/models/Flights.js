import {elements} from '../views/base';
import * as view from '../views/flightsView';
const url = "https://server-bd.eu-gb.mybluemix.net";

export default class Flights{
    constructor(){
        this.flightId = null;
        this.allFlightsData = null;
    }

    addFlight(flight){
        this.flightId = flight;
    }

    addFlights(data){
        this.allFlightsData = data;
    }

    getFlightInfo(worker){
        fetch(`${url}/staff/${worker}/flights/${this.flightId}`)
        .then(res => res.json())
        .then(res => {
            var flight = this.allFlightsData.find(element => element.rejs == this.flightId);
            view.showDetails(res[0], flight);
        })
        .catch(error => console.log(error));
    }

    getCrew(){
        fetch(`${url}/flights/${this.flightId}/staff`)
        .then(res => res.json())
        .then(res => {
            view.showCrew(res);
        })
        .catch(error => console.log(error));
    }

    clearData(){
        this.flightId = null;
        this.allFlightsData = null;       
    }
}