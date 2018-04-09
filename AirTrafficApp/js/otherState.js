let stateXml = new XMLHttpRequest();
let table = " ";
let otherCities = document.querySelector('.otherCities');
let flightboardAll = document.querySelector('.flightboardAll');
let searchAllFlights = document.querySelector('.searchAllFlights');
let infoPlane = document.querySelector('.infoPlane');
let tBodyFlightAll = document.querySelector('#tBodyFlightAll');

function otherState() {
    stateXml.open('GET', 'https://cors-anywhere.herokuapp.com/https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json')
    stateXml.addEventListener('readystatechange', function() {
        if (stateXml.readyState == 4 && stateXml.status == 200) {
            let data = JSON.parse(stateXml.responseText);
            flyboardAllPlanes(stateXml)
          
            var map = new google.maps.Map(document.getElementById('searchMap'), {
                center: {
                    lat: 42.361145,
                    lng: -71.057083
                },
                zoom: 8,
            });
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            searchBox.addListener('places_changed', function() {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                data.acList.forEach(function(el) {
                    places.forEach(function(place) {
                        if (!place.geometry) {
                            console.log("Returned place contains no geometry");
                            return;
                        }
                        var icon = {
                            url: 'img/icons/airplane-shape.svg',
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        // Create a marker for each place.
                        let marker = new google.maps.Marker({
                            map: map,
                            icon: icon,
                            position: new google.maps.LatLng(el.Lat, el.Long)
                        })
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

                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        } else {
                            bounds.extend(place.geometry.location);
                        }
                    });
                })
                map.fitBounds(bounds);
            });

        };
    })
    stateXml.send()
} // <-- FUNCTION OTHER STATE END

function flyboardAllPlanes(stateXml) {
    let data = JSON.parse(stateXml.responseText).acList;
    data.sort(function(a, b) {
        return parseFloat(b.Alt) - parseFloat(a.Alt)
    })
    data.forEach(function(el) {
       	table += "<tr>";
       	if (el.Alt <= '150000') {
            table += "<td>"+el.Alt+ "ft</td>"
        }else if (el.Alt >= '150000') {
        	table += '<td>Aircraft is in the atmosphere!</td>';
        }
        else{
            table += '<td>Information is not available</td>';
        }
       	
       	table += "<td>"+el.Icao+"</td>"
       	if (el.Cou) {
            table += '<td>' + el.Cou + ' </td>';
        }else{
            table += '<td>Information is not available</td>';
        }
        if (el.Year) {
            table += '<td>' +  el.Year + ' </td>';
        }else{
            table += '<td>Information is not available</td>';
        }
       	table += "</tr>"
    })
tBodyFlightAll.innerHTML = table;
}
otherState()