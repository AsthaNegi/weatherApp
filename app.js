const express = require("express");
const https = require("https"); //native node module
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
}); // app.get ends

app.post("/", function (req, res) {
  const query = req.body.cityName;
  // const apiKey = "5b78ad08643907efefd7725fce74ce98";
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  // https is used to make get request to openweather server
  https.get(url, function (response) {
    console.log(response.statusCode); // if status code is 200 then everything is working fine
     
    // getting hold on data received by API call 
    // giving a response when receiving a data
    response.on("data", function (data) {
      // parsing the data which was given in hexadecimal form into jvascript object with the help of json
      const weatherData = JSON.parse(data);
      //weatherData is the json object main.temp is the path to reach to temp
      const temp = weatherData.main.temp;
      //fetch the path of desc by viewing the url in JSON awesome viewer extension
      const weatherDescription = weatherData.weather[0].description;
      // adding image and grasping current weather icon
      const weatherIcon = weatherData.weather[0].icon;
      const imageURL =
        " http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";



      // sending the fetched data to the client side /browser by tapping to our response

      res.write("<h1>Temperature in " + query + " is " + temp + "degree</h1>");
      res.write(
        "<p >Current weather condition : " + weatherDescription + "</p>"
      );
      res.write("<img src=" + imageURL + ">");
      res.send();
    }); // response on ends
  }); // https ends 
}); // app.post ends

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
