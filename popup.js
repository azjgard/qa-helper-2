document.addEventListener("DOMContentLoaded", function() {

  // UI event listeners
  document.getElementById('initialize').addEventListener('click', init);

})

function init() {
  chrome.runtime.sendMessage({ 'message' : 'initialize' });
}
