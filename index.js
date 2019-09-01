import JSONEditor from "@json-editor/json-editor";
// This is the starting value for the editor
 // We will use this to seed the initial editor
 // and to provide a "Restore to Default" button.
//JSONEditor.defaults.theme = 'bootstrap4';
var jsgamDownload = document.querySelector('#download');
var jsgamUpload = document.querySelector('#upload');
// Initialize the editor
var editor = new JSONEditor(document.getElementById('editor_holder'),{
  // Enable fetching schemas via ajax
  ajax: true,
  theme : 'bootstrap4',
  iconlib : 'materialicons',
  // The schema for the editor
  schema: {
    $ref: "schemas/editor.json"
  },
  display_required_only:true,
  keep_oneof_values:false,
  enable_array_copy:true
});

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change',function() {
  // Get an array of errors from the validator
  var errors = editor.validate();

  var indicator = document.getElementById('valid_indicator');

  // Not valid
  if(errors.length) {
    indicator.style.color = 'red';
    indicator.textContent = "not valid";
  }
  // Valid
  else {
    indicator.style.color = 'green';
    indicator.textContent = "valid";
  }
});

//  Parse JSON string and return JSON object. Empty object returned on error
var parseJson = function(str) {
  var res;
  try {res = JSON.parse(str);}
  catch(e) {res = {};}
  return res;
};


 // Trigger mouse click event
 var eventClickFire = function(el) {
   el.dispatchEvent(new MouseEvent('click', {
     'view': window,
     'bubbles': true,
     'cancelable': false
   }));
 };
 // Save Schema, Start Value, JavaScript Styles and Config options in examples schema format
 var downloadJSONHandler = function() {
   var title = prompt('Enter the name of your file', 'New Adventure');
   if (title === null) return;
   var json = editor.getValue(),
       filename = (title || 'jsgam').toLowerCase().replace(/[\s<>:"\\|*]/g, "-") + '.json',
       blob = new Blob([JSON.stringify(json, null, 2)], {type: "application/json;charset=utf-8"});

   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob, filename);
   } else {
       var a = document.createElement('a');
       a.download = filename;
       a.href = URL.createObjectURL(blob);
       a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
       eventClickFire(a);
   }

 };

// Set button event for downloading as example
jsgamDownload.addEventListener('click', downloadJSONHandler, false);
