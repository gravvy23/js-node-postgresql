import {elements} from '../views/base';
import * as calendarView from '../views/calendarView';
const url = "https://server-bd.eu-gb.mybluemix.net";

export default class Calendar{
    constructor(month,year) {
        switch (month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                this.monthLenght = 31;
                break;
            case 2:
                this.monthLenght = 28;
                break;
            default:
                this.monthLenght = 30;
        }
        this.days = [];
        this.month = month;
        this.year = year;
    }

    searchResults(route) {
        fetch(`${url}/routes/${route}?month=${this.month}`)
            .then(res => res.json())
            .then(res => 
                {res.forEach(element => {
                    var day = element.data.split('-',3)[2]
                                          .split('T')[0];
                    day = parseInt(day);
                    this.days.push({
                        dayOfMonth: day,
                        price: element.cena_minimalna,
                        flight: element.lot
                    });
                    
                }),
                calendarView.showCallendar(new Date(this.year, this.month -1, 1).getDay(),this.days, this.month, this.monthLenght);
            })
            .catch(error => console.log(error));
    }
}