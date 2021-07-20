# The Simple Bus App

# What is it?

The Simple Bus App is an app that will tell you the bus stops that are near your location based on your coordinates. It will also list out all the busses that are available at the bus stop along with a static map showing you the approximate location of the bus stop from where you are.


## Prerequisites

In order to use this app, you need a key things:

* Node installed
* API key from DataMall 
  * This is a free set of APIs provided by the Land Transport Authority (LTA) of Singapore for various transport related datasets
  * You need this to be able to use the main API endpoints that are used for this project: `Bus Stops` and `Bus Arrival`
  * You can get the end point from here: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html 
* Setting up Supabase
  * Supabase is a cloud-based database service using Postgresql. It is marketed as a Firebase alternative
  * For this project, we have used this database to store the list of bus stops and run Remote Procedure Calls (RPCs) to find bus stops that are nearby
  * You can set this up here: https://supabase.io/
* Browserify
  * Allows you to use Node.js methods on browsers as they are not defined by the browser
  * If you can node installed you can install it using npm:
  * ``` npm install -g browserify ```


## The technical details

This section will explain the logic flow of how this app works

* On load, the app displays a single button and a tool tip (which explains how the app works) to the user to click
* On click, the app captures the user's latitude and longitude using the Geolocation API
* After getting this, a function call is made and the latitude and longitude are passed to it
* In the function, another async function call is made to the Supabase database that has an Remote Procedure Call (RPC) which takes in the user's latitude and longitude
  * The RPC inside takes in the user's latitude and longitude and run the Haversine formula in Postgresql on table containing all the bus stop codes, their street names, their names and their latitude and longitude for a fixed distance (for now it is set to 200m)
  * The RPC then returns the list of locations to the caller
* Back in the code, we need to make a new API calls for every bus stop that is returned to the `Bus Arrival` endpoint provided by DataMall to get all the bus numbers that are available at the bus stop
  *  We need to save the list of bus numbers in a list before changing that into a string of bus numbers
*  At this point, we will also generate the map links using One Map Static API, which we can pass the user and bus stop location (latitiude and longitude) to create the map on the fly
*  As a last step, we will pass this to another function that will generate the table used to display the bus stop code, the bus stop name, the bus numbers, and the map links

## Explain the technical challenges

This section covers some of the technical challenges that I faced when making this app

* Remote Procedure Calls
  * Though the concept was straightforward (creating a function that takes in values and runs a database call in this context), writing the function deemed challenging 
  * There are some examples online but they don't always explain the concepts very well for me to grasp 
  * This required a lot of hours of trial and error and consulation with TAs to get right
* Making an API call from the front end
  * Since there are some CORS related issues for making an API call from the frontend, I had to use a workaround for this project for now: https://alfilatov.com/posts/run-chrome-without-cors/

## Explain which improvements you might make

* I would want to make this app truly mobile and host it somewhere
* I would want to improve the UI of this and potentially add a live map to it as well
