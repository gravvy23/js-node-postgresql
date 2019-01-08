import {elements} from './base';
const url = "https://server-bd.eu-gb.mybluemix.net";

export const showCallendar = (firstDay,dayPrices,month, monthLength) => {
    elements.searchPageContent.innerHTML = `
            <div class="day invalid" id = "day-1">
                <div class="day__date off">pt 1 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-2">
                <div class="day__date off">sb 2 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-3">
                <div class="day__date off">nd 3 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-4">
                <div class="day__date off">pn 4 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-5">
                <div class="day__date off">wt 5 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-6">
                <div class="day__date off">sr 6 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-7">
                <div class="day__date off">czw 7 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-8">
                <div class="day__date off">pt 8 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-9">
                <div class="day__date off">sb 9 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-10">
                <div class="day__date off">nd 10 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-11">
                <div class="day__date off">pn 11 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-12">
                <div class="day__date off">wt 12 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-13">
                <div class="day__date off">sr 13 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-14">
                <div class="day__date off">czw 14 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-15">
                <div class="day__date off">pt 15 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-16">
                <div class="day__date off">sb 16 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-17">
                <div class="day__date off">nd 17 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-18">
                <div class="day__date off">pn 18 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-19">
                <div class="day__date off">wt 19 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-20">
                <div class="day__date off">sr 20 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-21">
                <div class="day__date off">czw 21 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-22">
                <div class="day__date off">pt 22 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-23">
                <div class="day__date off">sb 23 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-24">
                <div class="day__date off">nd 24 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-25">
                <div class="day__date off">pn 25 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-26">
                <div class="day__date off">wt 26 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-27">
                <div class="day__date off">sr 27 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-28">
                <div class="day__date off">czw 28 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-29">
                <div class="day__date off">pt 29 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-30">
                <div class="day__date off">sb 30 sty</div>
                <div class="day__price">---</div>
            </div>
            <div class="day invalid" id = "day-31">
                <div class="day__date off">nd 31 sty</div>
                <div class="day__price">---</div>
            </div>
    `;
    elements.searchPageContent.style.visibility = 'visible';
    if (firstDay == 0) firstDay = 7;
    //dodanie ceny
    for (var i = 0; i < dayPrices.length; i++){
        var element = document.getElementById(`day-${dayPrices[i].dayOfMonth}`);
        element.classList.remove('invalid');
        element.children[0].classList.remove('off');
        element.children[1].innerHTML = dayPrices[i].price + 'zł';
        element.dataset.goto = dayPrices[i].flight;
    }
    //ustawienie miesiaca
    var monthName;
    switch (month){
        case 1:
            monthName = 'sty';
            break;
        case 2:
            monthName = 'lut';
            break;
        case 3:
            monthName = 'mar';
            break;
        case 4:
            monthName = 'kwi';
            break;
        case 5:
            monthName = 'maj';
            break;
        case 6:
            monthName = 'czer';
            break;
        case 7:
            monthName = 'lip';
            break;
        case 8:
            monthName = 'sie';
            break;
        case 9:
            monthName = 'wrze';
            break;
        case 10:
            monthName = 'paź';
            break;
        case 11:
            monthName = 'list';
            break;
        case 12:
            monthName = 'gru';
            break;
    }
    //ustawienie nazwy dnia
    for (var i = 1; i <=31; ++i){
        var element = document.getElementById(`day-${i}`);
        if (i > monthLength){
            element.style.visibility = 'hidden';
            continue;
        }
        var week = Math.ceil((firstDay+i-1)/7);
        var day = (firstDay+i-2)%7 + 1;
        element.style.gridRowStart=week;
        element.style.gridColumnStart=day;
        var children = element.children;
        var name = children[0];
        var dayName;
        switch (day)
        {
            case 1:
                dayName='pn';
                break;
            case 2:
                dayName='wt';
                break;
            case 3:
                dayName='sr';
                break;
            case 4:
                dayName='czw';
                break;
            case 5:
                dayName='pt';
                break;
            case 6:
                dayName='sob';
                break;
            case 7:
                dayName='nd';
                break;
        }
        name.innerHTML = `${dayName} ${i} ${monthName}`;
    }
};

export const showDetails = (noOfPeople,data) => {
    
    fetch(`${url}/routes/info/${data.flight}`)
        .then(res => res.json())
        .then(res => {
            res = res[0];
            var czas = res.czas_lotu.split(':');
            var godzina = res.godzina.split(':').splice(0,2).join(':');
            var godzina_przylotu = new Date(new Date(0,0,0,godzina.split(':')[0],godzina.split(':')[1]).getTime() + (60*parseInt(czas[0])+parseInt(czas[1]) + 60*res.utc_diff)*60000);
            var minuty = godzina_przylotu.getMinutes().toString();
            if (minuty.length == 1) minuty = '0' + minuty;
            godzina_przylotu = [godzina_przylotu.getHours(),minuty].join(':');
            elements.searchDetailsContent.innerHTML =`
            <div class="details_container__price">od ${noOfPeople*parseFloat(data.minPrice)}zł</div>
            <div class="details_container__destination">
                <strong class="details_container__destination__time">${godzina}</strong>
                <small class="details_container__destination__abbr">${res.start}</small>
            </div>
            <div class="details_container__duration">
                <span class="details_container__duration__time">${res.czas_lotu.split(':')[0]}h ${res.czas_lotu.split(':')[1]}min</span>
                <ul class="details_container__duration__route"></ul>
                <span class="details_container__duration__number">${data.flight}</span>
            </div>
            <div class="details_container__origin">
                <strong class="details_container__origin__time">${godzina_przylotu}</strong>
                <small class="details_container__origin__abbr">${res.cel}</small>
            </div>
            <div class="details_container__persons">
                <span class="details_container__persons__intro">Twoje ceny biletów:</span>
                <span class="details_container__persons__tickets">Osoba x </span>
                <span class="details_container__persons__number">${noOfPeople}</span>
                <span class="details_container__persons__price">${data.minPrice}zł</span>
            </div>
            <button class="details_container__submit">
                <span>Kontynuuj</span>
            </button>`;
            elements.searchDetailsContent.style.visibility = 'visible';
            })
        .catch(error => console.log(error));
}