    const apiKey = "c2a03cfdac4518242446a39f25fc8c0c";

    // DOM (document object model) seletion (getting html elements)
    const searchButton = document.getElementById("searchButton");//method to find element that has matching id attribute in html document
    const cityInput = document.getElementById("cityInput");
    const locationButton = document.getElementById("locationButton")

    const cityName = document.getElementById("cityName");
    const temperature = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const details = document.getElementById("details");
    const details1 = document.getElementById("details1");
    const dateTime = document.getElementById("dateTime");

    function updateDateTime(){
        // create new object called now, updating current time and dete
        const now = new Date();

        // converts the date/time to a human readable string accoding to human's locale and set it as textContent of dateTime element
        // It shows current time in UI
        dateTime.textContent = now.toLocaleString();
    }

    updateDateTime();
    //repeatedly runs the above function at given interval , every minute 60000 milliseconds
    setInterval(updateDateTime, 60 * 1000);

    //javaScript funtion , accepts city as argument
    // (async - keyword) asynchronous operation(something that takes time, like network request) and might not finish instantly
    async function getWeather(city){

        //`` template literals(backticks)
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

        try{
            // fetch(url) - function used for network requests, asks api server for the data at the specified url
            // fetch is asynchronous, we use await to pause the function execution until data response is received from server
        
            const response = await fetch(URL);

            //response.ok - boolean property (
            if(!response.ok){
                throw new Error("City not found");
                //stops try block and moves to catch block
            }  

            //raw response needs to be converted to usable javaScript object
            //This method parses the data (which comes as a string formatted in JSON) into a JavaScript object.
            const data = await response.json();
            displayWeather(data);
        }
        catch(error){
            showError("City Not Found")
        }
    }   

    async function getWeatherByCoords(lat, lon){

        //`` template literals(backticks)
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

        try{
            // fetch(url) - function used for network requests, asks api server for the data at the specified url
            // fetch is asynchronous, we use await to pause the function execution until data response is received from server
        
            const response = await fetch(URL);

            //response.ok - boolean property (
            if(!response.ok){
                throw new Error("City not found");
                //stops try block and moves to catch block
            }  

            //raw response needs to be converted to usable javaScript object
            //This method parses the data (which comes as a string formatted in JSON) into a JavaScript object.
            const data = await response.json();
            displayWeather(data);
        }
        catch(error){
            showError("Unable to fetch Location");
        }
    }   

    function displayWeather(data){

        //.textContent - used to change the text displayed inside an html element
            cityName.textContent = `${data.name}, ${data.sys.country}`;
            temperature.textContent =  `${Math.round(data.main.temp)} °C`;
            condition.textContent = data.weather[0].main;
            details.textContent =  `Humidity: ${data.main.humidity}% `; 
            details1.textContent = `Wind: ${data.wind.speed} Km/h`

            const weatherIcon = document.getElementById("weatherIcon");
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherIcon.src = iconUrl;
            weatherIcon.alt = data.weather[0].description;
            weatherIcon.style.display = "block";

            const main = data.weather[0].main.toLowerCase();

            if (main.includes("rain")){
                document.body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
            }
            else if (main.includes("cloud")){
                document.body.style.background = "linear-gradient(135deg, #cfd9df, #e2ebf0)";
            }
            else if (main.includes("clear")){
                document.body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
            }
            else{
                document.body.style.background = "#6dd5";
            }
    }

    function showError(message){
        cityName.textContent = "Error!";
        temperature.textContent = "-- °C"
        condition.textContent = message;
        details.textContent = "";
        details1.textContent ="";
    }

    //register an event listener on search button
    //() => { ... }: This is an Arrow Function, a concise way to write an anonymous function (a function without a name)
    searchButton.addEventListener("click", () =>{
        //cityInput.value - gets text typed into input field
        const city = cityInput.value.trim();
        if(city != ""){
            getWeather(city);
        }
    });

    locationButton.addEventListener("click", () =>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getWeatherByCoords(lat, lon);
                },
                (error) => {
                    cityName.textContent = "Permission denied or unavailable";
                    temperature.textContent = "-- °C"
                    condition.textContent = "";
                    details.textContent = "";
                    details1.textContent =""; 

                }
            )
        }
    })

    cityInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            searchButton.click();
        }
    })