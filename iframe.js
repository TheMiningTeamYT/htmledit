window.onmessage = function(event) {
    document.getElementsByTagName("html")[0].innerHTML = event.data.replace(/<html>|<\/html>|<!DOCTYPE html>/g, "") + "<script src=\"iframe.js\"><\/script>";
    try {
    	document.querySelectorAll('script').forEach(e => eval(e.innerHTML));
    } catch(e) {
    	alert("An error occurred! " + e);
    }
};