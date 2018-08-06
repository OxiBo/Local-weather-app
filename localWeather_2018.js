$(document).ready(function() {
    const DOMstrings = {
        $temp: $('#temp'),
        $degrees: $('#degrees'),
        $background: $('html body, .container-fluid'),
        $location: $('#location'),
        $icon: $('#icon'),
        $description: $('#description'),
        $windSpeed: $('#windSpeed'),
        $humidity: $('#humidity'),
        $details: $('.details')
    };

    const images = {
        winterClouds: "winterClouds.jpeg",
        winterSnow: "winterSnow.jpg",
        winterClear: "winterClear.jpg",
        springClouds: "springClouds.jpg",
        springRain: "spring_rain",
        springRain1: "springRain1.jpg",
        springClear: "springClear1",
        summerClouds: "summerClouds.jpg",
        summerClouds1: "clouds.jpg",
        summerRain: "summerRain.jpg",
        summerClear: "summerClear.jpg",
        autumnRain: "autumn_rain",
        autumnRain1: "autumnRain2.jpg",
        autumnClouds: "autumnclouds.jpg",
        autumnClear: "autumnClear0.jpg",
        default: "default1.jpg"
    };


    let geolocationTimeout = setTimeout(function() {
        DOMstrings.$temp.text('Location information is unavailable.');
    }, 8000);

    // get json with city, state name and coordinates
    $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
        // console.log(data)
        if (data.geoplugin_latitude && data.geoplugin_longitude)
        {
            clearTimeout(geolocationTimeout);
            useGeolocationInfo(data);
        }
    })


    function useGeolocationInfo(json) {
        // console.log(json);
        const info = {
            city: json.geoplugin_city,
            state: json.geoplugin_regionCode,
            country: json.geoplugin_countryName,
            lat: json.geoplugin_latitude,
            lon: json.geoplugin_longitude,
        };

        // if (info.lat && info.lon) {
            // ajax request to get the weather
            $.ajax({
                    url: 'https://api.openweathermap.org/data/2.5/weather?',
                    data: {
                        lat: info.lat,
                        lon: info.lon,
                        appid: 'e005b47d860a06d7e4e18d731fa3e7a4',
                        units: 'metric'
                    },
                    dataType: 'json',
                    type: "GET"
                })
                .done(function(data) {
                    console.log(data);

                    info.temp = data.main.temp;
                    info.humidity = data.main.humidity;
                    info.weather = {
                        main: data.weather[0].main,
                        description: data.weather[0].description, //the one we are using
                        wind: data.wind.speed
                    };
                    info.icon = data.weather[0].icon;
                    info.ID = data.weather[0].id;

                    console.log(info)
                    displayInfo(info);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    DOMstrings.$temp.text('Failed to load local weather.')
                    console.log(errorThrown.toString());
                });
        // } else {
        //     DOMstrings.$temp.text('Location information is unavailable.');
        // }

        // console.log(info.weather.main)
        // console.log(JSON.stringify(info, null, 2));


    }

    let displayInfo = function(allInfo) {
        console.log(JSON.stringify(allInfo, null, 2));

        if (allInfo.state) {
            DOMstrings.$location.text(`${allInfo.city}, ${allInfo.state}, ${allInfo.country}`);
        } else {
            DOMstrings.$location.text(`${allInfo.city}, ${allInfo.country}`);
        }

        changeBackground();

        function changeBackground() {

            function setBackground(urlImage) {
                DOMstrings.$background.css('background-image', 'url("css/gallery/' + urlImage);
            };

            switch (true) {
                // winter clouds
                case (allInfo.temp <= 0 && (allInfo.id >= 801 && allInfo.id <= 804)):
                    setBackground(images.winterClouds);
                    break;

                    // winter snow
                case (allInfo.temp <= 0 && (allInfo.id >= 600 && allInfo.id <= 622)):
                    setBackground(images.winterSnow);
                    break;

                    // winter clear
                case (allInfo.temp <= 0 && allInfo.id == 800):
                case (allInfo.temp <= 0):
                    setBackground(images.winterClear);
                    break;

                    // spring clouds
                case ((allInfo.temp > 15 && allInfo.temp < 24) && (allInfo.id >= 801 && allInfo.id <= 804)):
                    setBackground(images.summerClouds);
                    break;

                    // spring rain
                case ((allInfo.temp > 15 && allInfo.temp < 24) && (allInfo.id >= 200 && allInfo.id <= 531)):
                    setBackground(images.summerRain);
                    break;

                    // spring clear
                case ((allInfo.temp > 15 && allInfo.temp < 24) && allInfo.id == 800):
                case (allInfo.temp > 15 && allInfo.temp < 24):
                    setBackground(images.springClear);
                    break;

                    // summer clouds
                case (allInfo.temp > 24 && (allInfo.id >= 801 && allInfo.id <= 804)):
                    setBackground(images.summerClouds);
                    break;

                    // summer rain
                case (allInfo.temp > 24 && (allInfo.id >= 200 && allInfo.id <= 531)):
                    setBackground(images.summerRain);
                    break;

                    // summer clear
                case (allInfo.temp > 24 && allInfo.id == 800):
                case (allInfo.temp > 24):
                    setBackground(images.summerClear);
                    break;

                    // autumn rain
                case ((allInfo.temp < 15 && allInfo.temp > 0) && (allInfo.id >= 200 && allInfo.id <= 531)):
                    setBackground(images.autumn_rain);
                    break;

                    // autumn clouds
                case ((allInfo.temp < 15 && allInfo.temp > 0) && (allInfo.id >= 801 && allInfo.id <= 804)):
                    setBackground(images.autumnClouds);
                    break;

                    // autumn clear
                case ((allInfo.temp < 24 && allInfo.temp > 0) && allInfo.id == 800):
                case (allInfo.temp < 24 && allInfo.temp > 0):
                    setBackground(images.autumnClear);
                    break;

                default:
                    setBackground(images.default);
            }


        }

        // display weather details
        DOMstrings.$icon.attr('src', 'http://openweathermap.org/img/w/' + encodeURIComponent(allInfo.icon + '.png'));
        DOMstrings.$description.text(allInfo.weather.description);
        DOMstrings.$windSpeed.text('WS ' + (allInfo.weather.wind).toFixed(2) + ' m/s');
        DOMstrings.$humidity.text(`humidity ${allInfo.humidity}%`);
        DOMstrings.$details.fadeIn(2000).css("display", "flex");

        displayTemp();

        function displayTemp() {

            let F = false;
            let C = convert(allInfo.temp, F);
            DOMstrings.$temp.text(C);
            DOMstrings.$degrees.text('\u2103');

            // convert Celsius and Fahrenheit
            function convert(C, F) {
                if (F) return ((C * 1.8) + 32).toFixed(2);
                return C.toFixed(1);
            }

            // toggle between Celsius and Fahrenheit
            DOMstrings.$degrees.on('click', function() {
            F = !F;
            DOMstrings.$temp.text(convert(allInfo.temp, F));
            if (F) {
                DOMstrings.$degrees.text('\u2109');
            } else {
                DOMstrings.$degrees.text('\u2103');
            }
            });
        };
    }
})




// doSmth()
// test()
// console.log(test())
// console.log(newFunc)

// console.log(obj)
// console.log(obj)
// console.log("I got IP " + obj.ID)
// console.log("this is data" + obj.load)


// console.log("this is test " + test);





// // set endpoint and your access key
// var ip = '134.201.250.155'
// var access_key = 'YOUR_ACCESS_KEY';

// // get the API result via jQuery.ajax
// $.ajax({
//     url: 'http://api.ipstack.com/' + ip + '?access_key=' + access_key,
//     dataType: 'jsonp',
//     success: function(json) {

//         // output the "capital" object inside "location"
//         alert(json.location.capital);

//     }
// });
