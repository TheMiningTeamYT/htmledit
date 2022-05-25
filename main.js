var htmlIframe = document.getElementById("htmlIframe");
var extraTab = false;
document.getElementById("submitHTML").addEventListener("click", function() {
    var HTML = document.getElementById("htmlArea").value;
    htmlIframe.contentWindow.postMessage(HTML, "*");
});
// Thank you Greg Ross of Stack Overflow!
document.getElementById("htmlArea").addEventListener("keydown", keyDown);
document.getElementById("download").addEventListener("click", function() {
  download(document.getElementById("htmlArea").value, "download.html", "text/html");
});
window.addEventListener("keydown", saveKey);
document.getElementById('upload-HTML-button').addEventListener('click', async function() {
    var files = document.getElementById('upload-HTML-files').files;
    if (files.length > 0) {
      document.getElementById("htmlArea").value = await getText(files[0]);
    } else {
      alert("You didn't upload a file. Please try again.");
    }
});

function saveKey(e) {
  if (e.keyCode == 83) {
    if (e.ctrlKey === true) {
      e.preventDefault();
      download(document.getElementById("htmlArea").value, "download.html", "text/html");
    }
  }
}

function keyDown(e) {
    
    // press tab.
    if (e.key == "Tab") {
        e.preventDefault();
        
        // Insert a space.
        if (e.target.selectionStart == e.target.selectionEnd) {
          insertAtCaret(e.target, "    ");
        } else if (e.shiftKey === false) {
          var text = e.target.value.substr(e.target.selectionStart, (e.target.selectionEnd - e.target.selectionStart));
          var selectionStart = e.target.selectionStart;
          var selectionEnd = e.target.selectionEnd;
          var oldLength = text.length;
          text = text.replace(/\n/g, "\n    ");
          var newLength = text.length;
          e.target.value = e.target.value.substr(0, e.target.selectionStart) + "    " + text + e.target.value.substr(e.target.selectionEnd);
          e.target.selectionStart = selectionStart + 4;
          e.target.selectionEnd = selectionEnd + (newLength - oldLength) + 4;
        } else {
          var text = e.target.value.substr(e.target.selectionStart, (e.target.selectionEnd - e.target.selectionStart));
          var selectionStart = e.target.selectionStart;
          var selectionEnd = e.target.selectionEnd;
          var oldLength = text.length;
          text = text.replace(/\n    /g, "\n");
          var newLength = text.length;
          e.target.value = e.target.value.substr(0, (e.target.selectionStart - 4)) + text + e.target.value.substr(e.target.selectionEnd);
          e.target.selectionStart = selectionStart - 4;
          e.target.selectionEnd = selectionEnd + (newLength - oldLength) - 4;
        }
        
        return;
    } else if (e.key == "Backspace") {
      var cursorPosition = e.target.selectionStart;
      if ((e.target.selectionStart == e.target.selectionEnd) && e.target.value.substr((cursorPosition - 4), 4) == '    ') {
        e.preventDefault();
        e.target.value = e.target.value.substr(0, (cursorPosition - 4)) + e.target.value.substr(e.target.selectionEnd);
        e.target.selectionStart = e.target.selectionEnd = cursorPosition - 4;
      }
    } else if (e.key == "Enter") {
      var cursorPosition = e.target.selectionStart;
      if (e.target.selectionStart == e.target.selectionEnd) {
        e.preventDefault();
        var text = e.target.value.substr(0, cursorPosition);
        var lastIndex = text.lastIndexOf("\n");
        text = text.slice(lastIndex + 1);
        var firstIndex = text.search(/\S/g);
        if (firstIndex == -1) {
        } else {
          text = text.slice(0, firstIndex);
        }
        if (extraTab === true) {
          text = "    " + text;
          extraTab = false;
        }
        e.target.value = e.target.value.substr(0, cursorPosition) + "\n" + text + e.target.value.substr(e.target.selectionEnd);
        e.target.selectionStart = e.target.selectionEnd = cursorPosition + text.length + 1;
      }
    } else if (e.key == "{") {
      extraTab = true;
    } else if (e.key == "}") {
      var cursorPosition = e.target.selectionStart;
      if (extraTab === false) {
          extraTab = false;
          e.preventDefault();
          e.target.value = e.target.value.substr(0, (cursorPosition - 4)) + "}" + e.target.value.substr(e.target.selectionEnd);
          e.target.selectionStart = e.target.selectionEnd = cursorPosition - 3;
      }
    }
}

// Thank you RapTToR of https://www.codegrepper.com/ !
function insertAtCaret(txtarea, text) {
  var strPos = 0;
  var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false));
  if (br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    strPos = range.text.length;
  } else if (br == "ff") strPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0, strPos);
  var back = (txtarea.value).substring(strPos, txtarea.value.length);
  txtarea.value = front + text + back;
  strPos = strPos + text.length;
  if (br == "ie") {
    txtarea.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -txtarea.value.length);
    range.moveStart('character', strPos);
    range.moveEnd('character', 0);
    range.select();
  } else if (br == "ff") {
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();
  }
}

// Thank you Awesomeness01 and Kanchu on stack overflow!
// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
  }
}

// Thank you joshua.paling and Chong Lip Phang on stack overflow.
function getText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}