import express from 'express';
// const express = require('express');
import bodyParser from 'body-parser';
// const bodyParser = require('body-parser');
import fetch from 'node-fetch';
// const {fetch} = require('node-fetch');
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
import dotenv from 'dotenv'; 


const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: true}));

dotenv. config({ silent: true });

app.get('/', (req, res) => {
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = dirname(__filename);
    const sendData = {
        location: "Location",
        temp: "Temp",
        desc: "Description",
        feel: "Feel-like",
        humidity: "Humidity",
        speed: "Speed"
    }
    res.render("index", {sendData: sendData});
});

app.post('/', async (req, res) =>{
    try{
        let location = await req.body.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
          }
        const weatherData = await response.json();
        const temp = Math.floor(weatherData.main.temp);
        const desc = weatherData.weather[0].description;
        const sendData = {};
        sendData.temp = temp;
        sendData.desc = desc;
        sendData.location = location;
        sendData.feel = weatherData.main.feels_like;
        sendData.humidity = weatherData.main.humidity;
        sendData.speed = weatherData.wind.speed;
        sendData.country = weatherData.sys.country;
        res.render("index", {sendData: sendData});
    }
    catch (err) {
        console.log(err);
    }
   
})

app.listen(3000, () =>{
    console.log("server is running");
})