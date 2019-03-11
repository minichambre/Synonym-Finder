    var words;
    const blacklistedWords = ["i", "the", "and"];
    function lookup(word){

      if (blacklistedWords.includes(word.toLowerCase())){
        document.getElementById('newSentence').innerHTML = document.getElementById('newSentence').innerHTML  + " " + word;
        if (words.length > 0){
          lookup(words.shift());
        }
        return;
      }


      if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
          var httpRequest = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // IE 6 and older
          var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }

      httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            //console.log(httpRequest.responseText);
            consumeJson(httpRequest.responseText, word);
          } else {
            throwError("The thesaurus is on fire. Try again later.")
          }
        }
      };
      httpRequest.open('GET', 'https://dictionaryapi.com/api/v3/references/thesaurus/json/'+ word +'?key=85898d4a-ed99-47bb-843e-c11f078085bd', true);
      httpRequest.send();

    }

    function search(element){
      let currentSentence = document.getElementById('sentence').value;
      document.getElementById('newSentence').innerHTML = "";
      document.getElementById("error").style.display = "none";
      words = currentSentence.split(" ");

      if (words.length > 10){
        throwError("That's a bit long isn't it?");
        return;
      }
      lookup(words.shift());
    }

    function consumeJson(json, originalWord){
      var defintions = JSON.parse(json);
      if (defintions.length == 0){
        var word = originalWord
      }
      else if (defintions[0].meta !== undefined ){
        var syns = defintions[0].meta.syns[0];
        var word = syns[Math.floor(Math.random() * Math.floor((syns.length-1)))];
      } else {
        var word = originalWord;
      }

      document.getElementById('newSentence').innerHTML = document.getElementById('newSentence').innerHTML  + " " + word;
      if (words.length > 0){
        lookup(words.shift());
      }
    }

    function throwError(error){
      var errorNode = document.getElementById("error");
      errorNode.innerHTML = "";
      errorNode.innerHTML = error;
      errorNode.style.display = "block";
    }


    function minimise(){
      const ipc = require('electron').ipcRenderer;
      ipc.send('minimise-main-window');
    }

    function closeWindow(){
      const ipc = require('electron').ipcRenderer;
      ipc.send('close-main-window');
    }
