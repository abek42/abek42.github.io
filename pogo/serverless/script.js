/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
const COOKIE_CFG = "STORED_BOARD";
let ticketState;

function init() {
  let code;
  let previousBoard = getStoredBoardCode();
  let mode="NO_CODE";
  
  if(location.search.length==0){
	  code = prompt("Please enter the ticket string", "Ticket");
      if (code != "") {
	     mode="NEW_CODE";
	  }
  }

  let qry = chkQueryVariable("clear");
  if (qry) {
	  code = prompt("Please enter new ticket string", "Ticket");
      if (code != "") {
		mode="NEW_CODE";  
	  }
	  clearCookie(COOKIE_CFG);
  }
  
  qry = chkQueryVariable("t");
  if(qry){
	  code = qry.substr(qry.length-6,6);
	  mode="NEW_CODE";
  }
  
  
  if(previousBoard==""){//no previous board, just
	switch(mode){
		case "NEW_CODE":
			if(!buildTicket(code)){
				alert("Cannot proceed without valid code");
			}
			break;
		case "NO_CODE":
			alert("Cannot proceed without valid code");
	}  
  }
  else{
	  if(previousBoard!=code){//old exists, remove and add new if available
		  clearCookie(COOKIE_CFG);
		  switch(mode){
			case "NEW_CODE":
				if(!buildTicket(code)){
					alert("Cannot proceed without valid code");
				}
				break;
			case "NO_CODE":
				alert("Cannot proceed without valid code");
			}  
	  }
	  else{
		getPrevious();  
	  }
  }
 
}

function getStoredBoardCode() {
  let previous = getCookie(COOKIE_CFG);
  if (previous == "") {
    //nothing stored
    return "";
  } else {
    //yes stored
    let parsed = JSON.parse(previous);
    return parsed.code;
  }
}

function getNewTicket(code) {
  console.log("getNewTicket>code:",code);
  loadTicket(code)
    .then(d => {
      //call after load ticket
      setClicks();
      ticketState = d;
      ticketState.clickedCells = [];
      ticketState.code = code;
      setTicketCodes(ticketState.code, ticketState.validator);
      saveCookie(ticketState,COOKIE_CFG);
    })
    .catch(e => {
      alert("Failed to get ticket with error: " + e);
    });
}

function getPrevious() {
  let previous = getCookie(COOKIE_CFG);
  if (previous == "") {
    return "NAVL";
  } else {
    let parsed = JSON.parse(previous);
    ticketState = parsed;
    setByNumbers(parsed.numbers);
    if (parsed.clickedCells) {
      setClicked(parsed.clickedCells);
    }
    setClicks();
    setTicketCodes(ticketState.code, ticketState.validator);
  }
  return ticketState.code;
}

function loadTicket(code) {
  return new Promise((resolve, reject) => {
    getTicket(code)
      .then(d => {
        setByNumbers(d.numbers);
        console.log("data", d);
        resolve(d);
      })
      .catch(e => {
        console.log("ERR: no such ticket", e);
        reject("No such ticket");
      });
  });
}

function getTicket(code) {
  //get ticket data as JSON via an xhr request
  //tbd
  return new Promise((resolve, reject) => {
    /*XHR malarkey here*/
    var xmlhttp = new XMLHttpRequest();
    let url = "/ticket/" + code;

    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.responseText);
        resolve(data);
      }
      if (this.readyState == 4 && this.status == 404) {
        reject("No such ticket code");
      }
    };
    xmlhttp.onerror = function(e) {
      console.log("XHR Error", e);
      reject(e);
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  });
}

function setByNumbers(nums) {
  for (let i = 0; i < 3; i++) {
    setByRow(
      document.getElementById("row" + (i + 1)),
      nums.slice(i * 9, i * 9 + 9)
    );
  }
}

function setByRow(hnd, nums9) {
  console.log("setByRow", nums9);
  let cloneFill = hnd.firstElementChild.children[0].cloneNode(true);
  let cloneEmpty = hnd.firstElementChild.children[1].cloneNode(true);

  //clear the first cell in the row
  hnd.firstElementChild.removeChild(hnd.firstElementChild.children[0]);
  hnd.firstElementChild.removeChild(hnd.firstElementChild.children[0]);

  for (let i = 0; i < nums9.length; i++) {
    setCell(
      nums9[i],
      hnd.children[i],
      cloneFill.cloneNode(true),
      cloneEmpty.cloneNode(true)
    );
  }
}

function setCell(num, cell, fill, empty) {
  if (num == "") {
    empty.classList.remove("hide");
    empty.classList.add("show");
    cell.appendChild(empty);
  } else {
    setViewMode(fill, "show", "hide");
    setViewMode(fill.firstElementChild, "show", "hide");
    cell.appendChild(fill);
    setSource(fill.getElementsByClassName("pokemon")[0], num);
    setName(fill.getElementsByClassName("name")[0], num);
    fill.getElementsByClassName("num")[0].innerHTML=num;
  }
}

function setSource(hnd, num) {
  hnd.src = getSource(num);
}

function getSource(num) {
  //console.log("TBD: populate sourceMap");
  return sourceMap[num - 1].src;
  //return "https://cdn.glitch.com/df883ba1-2df1-41c9-b205-be5a4c437e6a%2Fdunno.png?v=1608171828616";
  //return sourceMap[num*1].src;
}

function setName(hnd, num) {
  hnd.innerHTML = getName(num);
}

function getName(num) {
  //console.log("TBD: populate sourceMap");
  return /*sourceMap[num - 1].id + "-" +*/ sourceMap[num - 1].name;
  //return "Dunno";
  //return sourceMap[num*1].src;
}

function setClicks() {
  let hndPokes = document.getElementsByClassName("pokemon");
  let hndBalls = document.getElementsByClassName("ball");

  for (let i = 0; i < hndPokes.length; i++) {
    hndPokes[i].addEventListener("click", function(e) {
      console.log("poke", e.target.parentNode.parentNode.id);
      setViewMode(e.target.nextElementSibling, "show", "hide");
      setViewMode(e.target, "hide", "show");
      ticketState.clickedCells.push(e.target.parentNode.parentNode.id);
      saveCookie(ticketState,COOKIE_CFG);
    });
  }

  for (let i = 0; i < hndBalls.length; i++) {
    hndBalls[i].addEventListener("click", function(e) {
      console.log("ball", e.target.parentNode.parentNode.id);
      setViewMode(e.target.previousElementSibling, "show", "hide");
      setViewMode(e.target, "hide", "show");
      ticketState.clickedCells.splice(
        ticketState.clickedCells.findIndex(
          i => i == e.target.parentNode.parentNode.id
        ),
        1
      );
      saveCookie(ticketState,COOKIE_CFG);
    });
  }
}

function setViewMode(hnd, addSetting, removeSetting) {
  hnd.classList.remove(removeSetting);
  hnd.classList.add(addSetting);
}

function setClicked(clickList) {
  for (let i = 0; i < clickList.length; i++) {
    let hnd = document.getElementById(clickList[i]).firstElementChild;
    setViewMode(hnd.getElementsByClassName("pokemon")[0], "hide", "show");
    setViewMode(hnd.getElementsByClassName("ball")[0], "show", "hide");
  }
}

function setTicketCodes(c, v) {
  document.getElementById("tCode").innerHTML = " "+c;
  document.getElementById("vCode").innerHTML = " "+v;
}

function chkQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  //if no bounce path was specified
  return false;
}

function hide(self){
  self.parentElement.parentElement.style="display:none;"; 
}

const buildTicket = winStr => {
  let str = "";
  let ticket = {numbers:["","","", "","","", "","","","","","", "","","", "","","","","","", "","","", "","",""],date:""};
  if(winStr.length!=40) return false;
  
  for (let i = 0; i < 30; i += 2) {
    
    let pos = strEnc.indexOf(winStr.substr(i,1));
    let val = strEnc.indexOf(winStr.substr(i+1,1))-27;
    //str += winStr.substr(i, 1) +pos+ ":"+winStr.substr(i+1,1)+val+",";
    ticket.numbers[pos]=val+(pos%9)*10;
    //ticket.numbers[strEnc.indexOf(winStr.substr(i,1))]=strEnc.indexOf(winStr.sub)
  }
  let ts = winStr.substr(30,4);
  ticket.date= ((strEnc.indexOf(ts.substr(0,1))+1)+"").padStart(2,"0")+"-"+(strEnc.indexOf(ts.substr(1,1))+"").padStart(2,"0")+"T"+(strEnc.indexOf(ts.substr(2,1))+"").padStart(2,"0")+":"+(strEnc.indexOf(ts.substr(3,1))+"").padStart(2,"0");
  //console.log(ticket.date,ticket.numbers.join(","));
  
  setByNumbers(ticket.numbers);
  setClicks();
  ticketState = ticket;
  ticketState.clickedCells = [];
  ticketState.code = code;
  setTicketCodes(ticketState.code, ticketState.validator);
  saveCookie(ticketState,COOKIE_CFG);
  
  return true;
};
