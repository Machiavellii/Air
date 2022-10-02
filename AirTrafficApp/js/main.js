let xml = new XMLHttpRequest();
let text = '';
let map = document.getElementById("map");
let btn = document.querySelector('#btnMap');
let switchBtn = document.querySelector('.switch');
let header = document.querySelector('.header');
let searchDiv = document.querySelector('.searchDiv');
let input = document.querySelector('.form-control');
let tBody = document.querySelector('#tBody');
let flydetaliesDiv = document.querySelector('.flydetalies');
let tBodyFlight = document.querySelector('#tBodyFlight');
let flightboardDiv = document.querySelector('.flightboard');
let shareDiv = document.querySelector('.shareDiv');
let close = document.querySelector('.close')

btn.addEventListener('click', findLocation);

close.addEventListener('click', e=> {
    shareDiv.style.display = 'none';
})

function findLocation(e) {
    if (!navigator.geolocation) {
        map.innerHTML = "<p>Geolocation is not supported by your browser</p>"
        return;
    }

    function success(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let latlng = {
            lat,
            lng
        };
        //let latBoston = 42.361145;
        //let lngBoston = -71.057083;
        //let bos = {lat:42.361145, lng:-71.057083}
        //let boston = {lat:42.361145, lng:-71.057083}


        xml.open("GET", "https://cors-anywhere.herokuapp.com/https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=" + lat + "&lng=" + lng + "&fDstL=0&fDstU=100");
        xml.addEventListener('readystatechange', function() {
            if (xml.readyState == 4 && xml.status == 200) {
                let data = JSON.parse(xml.responseText);
                header.style.display = 'block';
                searchFlight(xml);
                flightBoard(xml)
                let map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 8,
                    center: latlng,
                });
                data.acList.forEach( el => {
                    size = 20;
                    var image = {
                        url: 'img/icons/airplane-shape.svg',
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    let marker = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(el.Lat, el.Long),
                        icon: image,
                        title: 'Company: ' + el.Op + ';   Model: ' + el.Man + ';   Country: ' + el.Cou
                    });

                    let contentInfo = '<div> Model: ' + el.Man + '<br> Type: ' + el.Type + '<br> Country: ' + el.Cou + '<br> Fly Number: ' + el.Icao + '<br> Registration: ' + el.Reg + '</div>'
                        //INFO MARKER
                    marker.info = new google.maps.InfoWindow({
                        content: contentInfo
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        // this = marker
                        this.info.open(marker, this);
                        // Note: If you call open() without passing a marker, the InfoWindow will use the position specified upon construction through the InfoWindowOptions object literal.
                    });
                })

            };
        })
        xml.send()
    }

    function error() {
        map.innerHTML = "<p>Application need know your location!!!</p>";
    }
    map.innerHTML = "<p>Locating…</p>";
    switchBtn.style.display = 'none';
    navigator.geolocation.getCurrentPosition(success, error);

}; //Function FindLocation END

function searchFlight(xml) {
    let data = JSON.parse(xml.responseText).acList;
    input.addEventListener('keyup', function() {
        if (this.value.length >= 3) {
            let inputValue = this.value.toUpperCase();
            let filterSearch = data.filter( el => el.Icao.toUpperCase().includes(inputValue))
                    
            text = '';
            
            text += '<tr>';
            text += '<td>' + filterSearch[0].Mdl + '</td>';
            text += '<td>' + filterSearch[0].From + ' - ' + filterSearch[0].To + '</td>';
            text += '<td>' + filterSearch[0].Dst + ' Km</td>';
            text += '<td><img src="//logo.clearbit.com/' + filterSearch[0].Op + '.com?size=80&greyscale=true"></td>';
            text += '</tr>';
            tBody.innerHTML = text;
            flydetaliesDiv.style.display = 'block';

        } else {
            text = " ";
            tBody.innerHTML = text;
            flydetaliesDiv.style.display = 'none';
        }
    })

};

function flightBoard(xml) {
    let data = JSON.parse(xml.responseText).acList;
    data.sort(function(a, b) {
        return parseFloat(b.Alt) - parseFloat(a.Alt)
    })
    data.forEach( el =>{
        text += '<tr>';
        text += '<td>' + el.Alt + ' ft</td>';
        text += '<td>' + el.Icao + '</td>';
        if (el.To) {
            text += '<td>' + el.To + ' </td>';
        }else{
            text += '<td>Information is not available</td>';
        }
        if ( el.Op) {
            text += '<td>' +  el.Op + ' </td>';
        }else{
            text += '<td>Information is not available</td>';
        }
        text += '</tr>';
    })

    tBodyFlight.innerHTML = text;
}

window.addEventListener('hashchange', function  () {
    let findHash = location.hash.substring(1);
    if (findHash === 'search') {
        map.style.width = '0';
        searchDiv.style.display = 'block';
         map.style.height = '0';
        flightboardDiv.style.display = 'none';
        otherCities.style.display = 'none';
        flightboardAll.style.display= 'none';
    }
    if (findHash === 'aroundme') {
        map.style.width = '100%';
        searchDiv.style.display = 'none';
         map.style.height = '91%';
        flightboardDiv.style.display = 'none';
        flightboardDiv.style.display = 'none';
        shareDiv.style.display = 'none';
        otherCities.style.display = 'none';
        flightboardAll.style.display= 'none';
    };
    if (findHash === 'flightboard') {
        map.style.width = '0';
        map.style.height = '0';
        searchDiv.style.display = 'none';
        shareDiv.style.display = 'none';
        flightboardDiv.style.display = 'block';
        otherCities.style.display = 'none';
        flightboardAll.style.display= 'none';
    }
    if (findHash === 'share') {
            shareDiv.style.display = 'block';
        }
    if (findHash === 'share') {
        shareDiv.style.display = 'block';
    }
    if (findHash === 'state') {
        otherCities.style.display = 'block';
        map.style.width = '0';
        map.style.height = '0';
        searchDiv.style.display = 'none';
        shareDiv.style.display = 'none';
        flightboardDiv.style.display = 'none';
        flightboardAll.style.display= 'none';
    };
    if (findHash === 'allFlights') {
        otherCities.style.display = 'none';
        flightboardAll.style.display= 'block';
    };
    return false;
})

