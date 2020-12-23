let sha3_256 = require("js-sha3").sha3_256;

const patterns = [
  { pattern: "111110000", val: 496 },
  { pattern: "111101000", val: 488 },
  { pattern: "111100100", val: 484 },
  { pattern: "111100010", val: 482 },
  { pattern: "111100001", val: 481 },
  { pattern: "111011000", val: 472 },
  { pattern: "111010100", val: 468 },
  { pattern: "111010010", val: 466 },
  { pattern: "111010001", val: 465 },
  { pattern: "111001100", val: 460 },
  { pattern: "111001010", val: 458 },
  { pattern: "111001001", val: 457 },
  { pattern: "111000110", val: 454 },
  { pattern: "111000101", val: 453 },
  { pattern: "111000011", val: 451 },
  { pattern: "110111000", val: 440 },
  { pattern: "110110100", val: 436 },
  { pattern: "110110010", val: 434 },
  { pattern: "110110001", val: 433 },
  { pattern: "110101100", val: 428 },
  { pattern: "110101010", val: 426 },
  { pattern: "110101001", val: 425 },
  { pattern: "110100110", val: 422 },
  { pattern: "110100101", val: 421 },
  { pattern: "110100011", val: 419 },
  { pattern: "110011100", val: 412 },
  { pattern: "110011010", val: 410 },
  { pattern: "110011001", val: 409 },
  { pattern: "110010110", val: 406 },
  { pattern: "110010101", val: 405 },
  { pattern: "110010011", val: 403 },
  { pattern: "110001110", val: 398 },
  { pattern: "110001101", val: 397 },
  { pattern: "110001011", val: 395 },
  { pattern: "110000111", val: 391 },
  { pattern: "101111000", val: 376 },
  { pattern: "101110100", val: 372 },
  { pattern: "101110010", val: 370 },
  { pattern: "101110001", val: 369 },
  { pattern: "101101100", val: 364 },
  { pattern: "101101010", val: 362 },
  { pattern: "101101001", val: 361 },
  { pattern: "101100110", val: 358 },
  { pattern: "101100101", val: 357 },
  { pattern: "101100011", val: 355 },
  { pattern: "101011100", val: 348 },
  { pattern: "101011010", val: 346 },
  { pattern: "101011001", val: 345 },
  { pattern: "101010110", val: 342 },
  { pattern: "101010101", val: 341 },
  { pattern: "101010011", val: 339 },
  { pattern: "101001110", val: 334 },
  { pattern: "101001101", val: 333 },
  { pattern: "101001011", val: 331 },
  { pattern: "101000111", val: 327 },
  { pattern: "100111100", val: 316 },
  { pattern: "100111010", val: 314 },
  { pattern: "100111001", val: 313 },
  { pattern: "100110110", val: 310 },
  { pattern: "100110101", val: 309 },
  { pattern: "100110011", val: 307 },
  { pattern: "100101110", val: 302 },
  { pattern: "100101101", val: 301 },
  { pattern: "100101011", val: 299 },
  { pattern: "100100111", val: 295 },
  { pattern: "100011110", val: 286 },
  { pattern: "100011101", val: 285 },
  { pattern: "100011011", val: 283 },
  { pattern: "100010111", val: 279 },
  { pattern: "100001111", val: 271 },
  { pattern: "011111000", val: 248 },
  { pattern: "011110100", val: 244 },
  { pattern: "011110010", val: 242 },
  { pattern: "011110001", val: 241 },
  { pattern: "011101100", val: 236 },
  { pattern: "011101010", val: 234 },
  { pattern: "011101001", val: 233 },
  { pattern: "011100110", val: 230 },
  { pattern: "011100101", val: 229 },
  { pattern: "011100011", val: 227 },
  { pattern: "011011100", val: 220 },
  { pattern: "011011010", val: 218 },
  { pattern: "011011001", val: 217 },
  { pattern: "011010110", val: 214 },
  { pattern: "011010101", val: 213 },
  { pattern: "011010011", val: 211 },
  { pattern: "011001110", val: 206 },
  { pattern: "011001101", val: 205 },
  { pattern: "011001011", val: 203 },
  { pattern: "011000111", val: 199 },
  { pattern: "010111100", val: 188 },
  { pattern: "010111010", val: 186 },
  { pattern: "010111001", val: 185 },
  { pattern: "010110110", val: 182 },
  { pattern: "010110101", val: 181 },
  { pattern: "010110011", val: 179 },
  { pattern: "010101110", val: 174 },
  { pattern: "010101101", val: 173 },
  { pattern: "010101011", val: 171 },
  { pattern: "010100111", val: 167 },
  { pattern: "010011110", val: 158 },
  { pattern: "010011101", val: 157 },
  { pattern: "010011011", val: 155 },
  { pattern: "010010111", val: 151 },
  { pattern: "010001111", val: 143 },
  { pattern: "001111100", val: 124 },
  { pattern: "001111010", val: 122 },
  { pattern: "001111001", val: 121 },
  { pattern: "001110110", val: 118 },
  { pattern: "001110101", val: 117 },
  { pattern: "001110011", val: 115 },
  { pattern: "001101110", val: 110 },
  { pattern: "001101101", val: 109 },
  { pattern: "001101011", val: 107 },
  { pattern: "001100111", val: 103 },
  { pattern: "001011110", val: 94 },
  { pattern: "001011101", val: 93 },
  { pattern: "001011011", val: 91 },
  { pattern: "001010111", val: 87 },
  { pattern: "001001111", val: 79 },
  { pattern: "000111110", val: 62 },
  { pattern: "000111101", val: 61 },
  { pattern: "000111011", val: 59 },
  { pattern: "000110111", val: 55 },
  { pattern: "000101111", val: 47 },
  { pattern: "000011111", val: 31 }
];

let order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const newRandOrder = (arr) => {
  //knuth / fisher-yates shuffle
  let currIdx = arr.length;
  let tmp, randIdx;

  // While there remain elements to shuffle...
  while (0 !== currIdx) {

    // Pick a remaining element...
    randIdx = Math.floor(Math.random() * currIdx);
    currIdx -= 1;

    // And swap it with the current element.
    tmp = arr[currIdx];
    arr[currIdx] = arr[randIdx];
    arr[randIdx] = tmp;
  }

  return arr;
};
const strEnc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const getValidator = (numbers, date) => {
  //numbers
  //R1-R3
  //1-9, x0-x9, 80-90

  //"abcdefghi jklmnopqr stuvwxyzA " --> cells of the ticket
  //BCDEF GHIJK L ->0-4 5-9 90 numbers...
  let encStr = "";
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] != "") {
      encStr += strEnc[i];
      if (numbers[i] != 90) {
        encStr += strEnc[(numbers[i] % 10) + 27];
      } else {
        encStr += "L";
      }
    }
  }

  //datestr MO-DD-HH-MM-SS
  //abcdefghijklmnopqrstuvwxyz (26)  ABCDEFGHIJKLMNOPQRSTUVWXYZ (52) 0123456789 (62)
  encStr +=
    strEnc[date.getMonth()] +
    strEnc[date.getDate()] +
    strEnc[date.getHours()] +
    strEnc[date.getMinutes()];
  console.log("validator>", encStr);
  return encStr;
};

const reconstructTicket = winStr => {
  let str = "";
  let ticket = {numbers:["","","", "","","", "","","","","","", "","","", "","","","","","", "","","", "","",""],date:""};
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
  
  return ticket;
};

const validateTicket = (winstrFull, salt) => {
  //winstr = 30char ticket, 4 char timestamp, 6 char sha256

  let result = { status: "TBD", numbers: [], timeStamp: "" };
  console.log("TBD:Decode", winstrFull, salt);

  //get winstr
  let winStr = winstrFull.substr(0, winstrFull.length - 6);
  //  console.log("TBD:Winstr", winStr, ws==winStr);

  let prevSha = winstrFull.substr(winstrFull.length - 6, 6);
  // let prevWinStr = str.substr(0, str.length - 6);
  let fullsha = sha3_256(winStr + salt);
  let newSha = fullsha.substr(fullsha.length - 6, 6);
  //console.log("validateTi", winStr, newSha, prevSha);
  if (prevSha == newSha) {
    result.status = "CHKOK";
    result.ticket=reconstructTicket(winStr);
    result.ticket.validator=winstrFull;
  } else {
    console.log("Expected", fullsha.substr(fullsha.length - 6, 6), prevSha);
  }
  return result;
};

//function makeTicket(){
const makeTicket = salt => {
  //get three patterns, which don't have a common zero point
  let getMore = true;
  let ticketRows = [];

  while (ticketRows.length < 3) {
    let row = patterns[Math.floor(Math.random() * patterns.length)];
    if (ticketRows.findIndex(t => t.val == row.val) < 0) {
      //not repeated
      let val = row.val;
      if (ticketRows.length == 2) {
        for (let i = 0; i < ticketRows.length; i++) {
          val = val | ticketRows[i].val;
        }
        if (val == 511) ticketRows.push(row);
      } else {
        ticketRows.push(row);
      }
    }
  }

  //console.log(ticketRows);

  //transform into ticket pattern
  let ticket = {
    numbers: ticketRows[0].pattern
      .split("")
      .concat(
        ticketRows[1].pattern.split("").concat(ticketRows[2].pattern.split(""))
      )
  };

  //populate numbers

  for (let i = 0; i < 9; i++) {
    //column0->8
    order = newRandOrder(order);
    let vals = [];
    let ctr = 0;
    switch (i) {
      case 0: //column0 has 1-9
        while (vals.length < 3) {
          if (order[ctr] % 10 != 0) {
            vals.push(order[ctr]); //save it
          }
          ctr++;
        }
        break;
      case 8: //column8 has 80-90
        vals[0] = order[0] + i * 10;
        vals[1] = order[1] + i * 10;
        vals[2] = order[2] + i * 10;
        break;
      default:
        //cols1-7 has x0-x9
        while (vals.length < 3) {
          if (order[ctr] != 10) {
            vals.push(order[ctr] + i * 10);
          }
          ctr++;
        }
    }
    vals.sort();
    //now we have number options
    for (let j = 0; j < 3; j++) {
      let idx = j * 9 + i;
      if (ticket.numbers[idx] == 1) ticket.numbers[idx] = vals[j];
      else ticket.numbers[idx] = "";
    }
  }

  console.log(ticket.numbers.join(","));

  //setup validation steps

  let date = new Date();
  let winString = getValidator(ticket.numbers, date);
  //ticket.winString = winString;
  let shaVal = sha3_256(winString + salt);

  //console.log("MK>",shaVal, shaVal.substr(shaVal.length-6,6));
  ticket.validator = winString + shaVal.substr(shaVal.length - 6, 6);
  ticket.code = shaVal.substr(shaVal.length - 6, 6);
  console.log(
    "winString>",
    ticket.validator,
    winString,
    salt,
    shaVal.substr(shaVal.length - 6, 6)
  );
  return ticket;
};

exports.makeTicket = makeTicket;
exports.validateTicket = validateTicket;
