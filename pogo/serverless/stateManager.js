function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookie(data,key="previous") {
  console.log("saveCookie",key);
  var d = new Date();
  d.setTime(d.getTime() + (2 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = key + "=" + JSON.stringify(data) + ";" + expires + ";path=/";
}

function clearCookie(key="previous"){
  document.cookie = key+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}