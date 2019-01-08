import {elements} from '../views/base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export default class Seats{
    constructor(){
        this.current = 1;
        this.selected = 0;
        this.whole = null;
    }

    setPeople(val){
        this.current = 1;
        this.whole = val;
        this.selected = 0;
    }

    addSeat(id,minPrice){
        var person = elements.peopleContent.children[this.current-1];
        var cena = parseInt(minPrice);
        if (id <= 6){
            cena += 500;
        } else if (id <= 18){
            cena += 50;
        }
        person.children[1].innerHTML = id;
        person.children[2].innerHTML = cena + '.00zł';
        this.current +=1;
        this.selected +=1;
    }

    deleteSeat(id){
        var people = elements.peopleContent.children;
        for (var i = 0; i < people.length; ++i){
            if (people[i].className == 'person_seat' && people[i].children[1].innerHTML == id)
            {
                people[i].children[1].innerHTML = '--';
                people[i].children[2].innerHTML = '---';
            this.current = i + 1;
            }
        }
        this.selected--;
        elements.seatSubmitbutton.style.visibility = 'hidden';
    }
    getSeat(id){
        var person = elements.peopleContent.children[id];
        return {
           seat: parseInt(person.children[1].innerHTML),
           price: parseInt(person.children[2].innerHTML.split('.')[0])
        }
    }

    clearData(){
        this.current = 1;
        this.selected = 0;
        this.whole = null;     
    }
}