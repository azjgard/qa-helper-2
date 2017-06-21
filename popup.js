document.addEventListener("DOMContentLoaded", function() {
  // UI event listeners
  document.getElementById('initialize').addEventListener('click', init);
  document.getElementById('run').addEventListener('click', run)
})

function run() {
  chrome.runtime.sendMessage({ 'message' : 'run' });
}
