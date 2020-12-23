let boardState;
const COOKIE_CFG="generator";

function init(){
  //load the blocks
  populateTiles();
  
  document.getElementById("currentDraw").addEventListener('click',function(){
    console.log("click");
    let currDraw=new Date();
    if(currDraw-boardState.lastDraw<3000){
      console.log("Too fast");
      return; //stop over-clicking
    }    
    boardState.lastDraw = currDraw; //save for next
    drawToken();
  });
  
  document.getElementById("resetBoard").addEventListener("click",function(){
    let code = prompt("Type 'RESET' to reset", "Ticket Code");
    if(code=="RESET"){
     clearCookie(COOKIE_CFG);
      location.reload();
    }    
  });
  
  let last=getPrevious();
  if(last=="NAVL"){
    boardState={drawn:[],bag:initBag(),lastDraw:new Date()};  
    
  }
}


function populateTiles(){
  //get link of each 
  let p1=document.getElementById("p1");
  let clone=p1.cloneNode(true);
  let parent=document.getElementById("r1-10");
  setDetails(p1,sourceMap[0]);
  for(let i=1;i<sourceMap.length;i++){
    let cloneNew=clone.cloneNode(true);
    setDetails(cloneNew,sourceMap[i]);
    parent.appendChild(cloneNew);
    if((i+1)%10==0) {
      console.log(i,"r"+(i+2)+"-"+(i+11));
      parent=document.getElementById("r"+(i+2)+"-"+(i+11));
    }
  }
}

function setDetails(hnd,src){
  let img=hnd.getElementsByClassName("pokemon")[0];
  img.src=src.src;
  hnd.getElementsByClassName("name")[0].innerHTML=src.id+"-"+src.name;
  hnd.id="p"+src.id;
}

function getPrevious(){
  let previous = getCookie(COOKIE_CFG);
  if (previous == "") {
    return "NAVL";
  } else {
    let parsed = JSON.parse(previous);
    boardState = parsed;
    setDrawn(parsed.drawn);
    saveCookie(boardState, COOKIE_CFG);
    
  }
 
  
}

function initBag(){
  let arr=sourceMap.map(p=>{return "p"+p.id;});
  return arr;
}

function setViewMode(hnd, addSetting, removeSetting) {
  hnd.classList.remove(removeSetting);
  hnd.classList.add(addSetting);
}

function setDrawn(drawn) {
  for (let i = 0; i < drawn.length; i++) {
    let hnd = document.getElementById(drawn[i]).firstElementChild;
    setViewMode(hnd.getElementsByClassName("pokemon")[0], "hide", "show");
    setViewMode(hnd.getElementsByClassName("ball")[0], "show", "hide");
  }
}

function drawToken(){
  //console.log("TBD: pull a random index from bag");
  let rIdx = Math.floor(boardState.bag.length*Math.random());
  
  //console.log("TBD: swap with last, random index and then pop-off",rIdx);
  let drawn=boardState.bag[rIdx];
  let drawnIdx=drawn.substr(1,3)*1-1;
  boardState.drawn.push(drawn);
  let last=boardState.bag.pop();
  if(rIdx!=boardState.bag.length){//randomly last one was selected
    boardState.bag[rIdx]=last;  
  }
  
  //console.log("TBD: set current draw image/text to pop-off value",drawn,drawnIdx);
  document.getElementById("currentDraw").src=sourceMap[drawnIdx].src;
  document.getElementById("currentPokename").innerHTML=sourceMap[drawnIdx].id+"-"+sourceMap[drawnIdx].name;
  //console.log("TBD: set captured on board");
  let hnd = document.getElementById(drawn).firstElementChild;
  setViewMode(hnd.getElementsByClassName("pokemon")[0], "hide", "show");
  setViewMode(hnd.getElementsByClassName("ball")[0], "show", "hide");
  //console.log("TBD: update cookie state");  
  saveCookie(boardState,COOKIE_CFG);  
}

function validate(){
  //
  let str = document.getElementById("validChk").value;
  console.log(str, str.length);
  if(str.length==40){
    console.log("Ready Check");
    let d=loadTicket(str);//.then(d=>{
      console.log("Done loading ticket");
      setTicketCodes(d.date, d.validator);
      setClicked(d.numbers,boardState.drawn);
    /*}).
    catch(e=>{
      alert("Ticket validation failed: "+e);
    });*/
  }
  else{
    alert("Incorrect size: "+str.length);
  }
  
}

const strEnc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const buildTicket = winStr => {
  let str = "";
  let ticket = {numbers:["","","", "","","", "","","","","","", "","","", "","","","","","", "","","", "","",""],date:""};
  if(winStr.length!=40) return {digest:false};
  
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
  ticket.code =winStr.substr(34,6);
  ticket.validator = winStr;
  //ticketState = ticket;
  ticket.clickedCells = [];
  //ticketState.code = code;
  setTicketCodes(ticket.code, ticket.validator);
  ticket.digest=true;
  
  return ticket;
};


function loadTicket(code) {
  let t=buildTicket(code);
  if(!t.digest){
	  alert("No such ticket");
  }
  else{
	  setByNumbers(t.numbers);
  }
  
  return t;
  /*
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
  });*/
}

function getTicket(code) {
  //get ticket data as JSON via an xhr request
  //tbd
  return new Promise((resolve, reject) => {
    /*XHR malarkey here*/
    var xmlhttp = new XMLHttpRequest();
    let url = "/validate/" + code;

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

let clones={init:false};

function setByRow(hnd, nums9) {
  console.log("setByRow", nums9);
  
  if(!clones.init){
    clones.cf=hnd.firstElementChild.children[0].cloneNode(true);
    clones.ce=hnd.firstElementChild.children[1].cloneNode(true);
    clones.init=true;
    
    //clear the first cell in the row
    hnd.firstElementChild.removeChild(hnd.firstElementChild.children[0]);
    hnd.firstElementChild.removeChild(hnd.firstElementChild.children[0]);

  }
  
  let cloneFill = clones.cf;
  let cloneEmpty = clones.ce;

  
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
  while(cell.children.length>0){
    cell.removeChild(cell.firstElementChild);
  }
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

function setTicketCodes(c, v) {
  document.getElementById("tCode").innerHTML = " "+c;
  document.getElementById("vCode").innerHTML = " "+v;
}

function setClicked(nums,drawn){
  console.log("TBD",nums, drawn);
  let setList = nums.filter((n,i)=>{
    let fnd=drawn.findIndex(d=>d=="p"+n)>-1;
    if(fnd){
      console.log("f",n,i);
      let row = (i-(i%9))/9+1;
      let clm = i%9+1;
      //eg. idx:16 ->
      let hnd = document.getElementById("c"+row+""+clm);
      console.log("Setting:",i,row,clm,hnd);
      setViewMode(hnd.getElementsByClassName("pokemon")[0], "hide", "show");
      setViewMode(hnd.getElementsByClassName("ball")[0], "show", "hide");  }
    return fnd;
  });
  console.log("setList",setList);
  
}


