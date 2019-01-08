import {elements} from './base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export const showSeats = (noOfPeople,flight) => {
    elements.searchDetailsContent.style.visibility = 'hidden';
    elements.searchPageContent.style.visibility = 'hidden';
    var people = '';
    for (var i = 0 ; i < noOfPeople; ++i){
        people+=`
        <div class="person_seat" id="person-${i+1}">
        <span>Osoba ${i+1}</span>
        <div class="person_seat_selected">--</div>
        <div class="person_seat_price">---</div>
        </div>`
    }
    fetch(`${url}/flights/${flight}`)
        .then(res => res.json())
        .then(res => {
            var seatsId = [];
            res.forEach(el => seatsId.push(el.id));
            Array.from(elements.seatButtons).forEach(el => {
                var id = parseInt(el.id.split('-')[1]);
                if (seatsId.indexOf(id) != -1){
                    if (el.dataset.goto == "bus"){
                        el.children[0].src = "svg/seat_premium.svg";
                    } else {
                        el.children[0].src = "svg/seat_free.svg";
                    }
                }
            });
        })
        .catch(error => console.log(error));
    elements.peopleContent.innerHTML = `
    ${people}
    
    `;
    elements.seatsContent.style.visibility = 'visible';
}

export const showReservationForm = (reservation) => {
    var sum = 0;
    var count = reservation.length;
    for (var i = 0; i < count; ++i){
        sum += reservation[i].cena;
        elements.reservationContainer.innerHTML +=`
        <from class="person_form" id="${i+1}">
                <span>Osoba ${i+1}</span>
                <input type="text" class="person_name" name="person_name" placeholder="Imię"></input>
                <input type="text" class="person_surname" name="person_surname" placeholder="Nazwisko"></input>
                <small>Data urodzenia</small>
                <small>Narodowość</small>
                <input type="date" name="bday" class="person_bday"  min="1918-12-31">
                <select class="person_nationality" name="person_nationality" aria-placeholder="Narodowość">
                        <option value="POL">POL</option>
                </select>
                <div class="person-luggage">
                    <div class="person-luggage__el" id="lug-1">
                        <strong>15kg bagaż rejestrowany</strong>
                        <small>94 zł za lot</small>
                        <img src="svg/baggage_small.svg" alt="search" height="60">
                        <div class="person-luggage__buttons">
                                <button class="btn-decrease_lugg">
                                    <img src="svg/minus-button.svg" alt="search" height="20">
                                </button>
                                <div class="person-luggage__count">0</div>
                                <button class="btn-increase_lugg">
                                    <img src="svg/plus-button.svg" alt="search" height="20">
                                </button>
                        </div>
                    </div>
                    <div class="person-luggage__el" id="lug-2">
                        <strong>23kg bagaż rejestrowany</strong>
                        <small>103 zł za lot</small>
                        <img src="svg/baggage_medium.svg" alt="search" height="60">
                        <div class="person-luggage__buttons">
                                <button class="btn-decrease_lugg">
                                    <img src="svg/minus-button.svg" alt="search" height="20">
                                </button>
                                <div class="person-luggage__count">0</div>
                                <button class="btn-increase_lugg">
                                    <img src="svg/plus-button.svg" alt="search" height="20">
                                </button>
                        </div>
                    </div>
                    <div class="person-luggage__el" id="lug-3">
                        <strong>26kg bagaż rejestrowany</strong>
                        <small>157 zł za lot</small>
                        <img src="svg/baggage_big.svg" alt="search" height="60">
                        <div class="person-luggage__buttons">
                                <button class="btn-decrease_lugg">
                                    <img src="svg/minus-button.svg" alt="search" height="20">
                                </button>
                                <div class="person-luggage__count">0</div>
                                <button class="btn-increase_lugg">
                                    <img src="svg/plus-button.svg" alt="search" height="20">
                                </button>
                        </div>
                    </div>
                </div>
            </from>
        `;
    }
    elements.reservationSum.innerHTML = sum + '.00zł';
};

export const getDatafromReservtionForm = (count) => {
    var data = [];
    for (var i = 0; i< count; ++i){
        var form = elements.reservationContainer.children[i];
        data.push({
            name:       form.children[1].value,
            surname:    form.children[2].value,
            bday:       form.children[5].value,
            nation:     form.children[6].value
        })
    }
    return data;
}

export const checkData = (data) => {
    for (var i = 0; i < data.length; ++i){
        if (data[i].name == '' || data[i].surname == '' || data[i].bday == '' || data[i].nation == '') return false;
        else if (data[i].name.split(' ').length > 1 || data[i].surname.split(' ').length > 1) {
            return false;
        }
    }
    return true;
}

export const decreaseLug = (decrease) => {
    var field = decrease.nextSibling.nextSibling;
        var count = parseInt(field.innerHTML)
        if (count > 0){
            field.innerHTML = --count;
            var lugType = decrease.closest('.person-luggage__el');
            lugType = parseInt(lugType.id.split('-')[1]);
            var total = parseFloat(elements.reservationSum.innerHTML.split('.')[0])
            switch (lugType){
                case 1:
                    total-=94;
                    break;
                case 2:
                    total-=103;
                    break;
                case 3:
                    total-=157;
                    break;
            }
            elements.reservationSum.innerHTML = total + '.00zł';
            var personId = parseInt(decrease.closest('.person_form').id) -1;
            return {
                personId: personId,
                luggId: lugType -1
            }
        }
        return null;
}

export const addLug = (increase) => {
    var field = increase.previousSibling.previousSibling;
    var count = parseInt(field.innerHTML)
    field.innerHTML = ++count;
    var lugType = increase.closest('.person-luggage__el');
    lugType = parseInt(lugType.id.split('-')[1]);
    var total = parseFloat(elements.reservationSum.innerHTML.split('.')[0])
    switch (lugType){
        case 1:
            total+=94;
            break;
        case 2:
            total+=103;
            break;
        case 3:
            total+=157;
            break;
    }
    elements.reservationSum.innerHTML = total + '.00zł';
    var personId = parseInt(increase.closest('.person_form').id) -1;
    return {
        personId: personId,
        luggId: lugType -1
    }
}