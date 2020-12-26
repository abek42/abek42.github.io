//// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
sha3_256 = require("js-sha3").sha3_256;

const ticketMaker = require("./ticketMaker");

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/images/:img", (request,response)=>{
  let imgSrc = process.env.IMG_PATH;
  //console.log("img",request.params.img, imgSrc);
  response.redirect(imgSrc+request.params.img); 
});

app.get("/validate/:id", (request, response) => {
  let result = ticketMaker.validateTicket(request.params.id, process.env.SALT);
  console.log("validation result:", result.status);
  if (result.status == "CHKOK") {
    response.json(result.ticket);
  } else response.sendStatus(404); //.json("Invalid Ticket" + request.params.id);
});

// send the default array of dreams to the webpage
app.get("/ticket/:id", (request, response) => {
  // express helps us take JS objects and send them as JSON
  //console.log(request.params.id, process.env["k" + request.params.id]);
  let ticket = ticketMaker.makeTicket(process.env.SALT);
  // console.log("Validator ", ticket.validator);
  console.log(
    ticketMaker.validateTicket(ticket.validator, process.env.SALT, ticket.code)
      .status
  );
  if (typeof process.env["k" + request.params.id] === "undefined")
    response.sendStatus(404);
  else response.json(ticket);
});

/*
app.get("/something/:id", (req, res) => { console.log(req.params.id); }); 
*/

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening s on port " + listener.address().port);
  //
});
