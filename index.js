import JSONEditor from "@json-editor/json-editor";
// This is the starting value for the editor
 // We will use this to seed the initial editor
 // and to provide a "Restore to Default" button.
//JSONEditor.defaults.theme = 'bootstrap4';
var jsgamDownload = document.querySelector('#download');
var jgameClear = document.querySelector('#clear');
var jsgamUpload = document.querySelector('#upload');
var jsgamFile = document.querySelector('#uploadFile');

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
  var indicatorIcon = document.getElementById('valid_icon');
  var indicatorText = document.getElementById('valid_text');

  // Not valid
  if(errors.length) {
    indicator.className="badge badge-pill badge-danger";
    indicatorIcon.textContent="clear";
    indicatorText.textContent=" Not Valid";
  }
  // Valid
  else {
    indicator.className="badge badge-pill badge-success";
    indicatorIcon.textContent="done";
    indicatorText.textContent=" Valid";
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
 // Save JSON
 var downloadJSON = function() {
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

 //Upload JSON
var uploadJSON = function(e) {
  e.preventDefault();
  var files = e.target.files || e.dataTransfer.files;
  if (files.length !== 0) {
    var file = files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
      var response = e.target.result;
      editor.setValue(parseJson(response));
      console.log(parseJson(response));
    };
    reader.readAsText(file)
  }

};

var clearJSON=function(){
  editor.setValue("{}");
}
// Set button event for downloading as example
jsgamDownload.addEventListener('click', downloadJSON, false);
jsgamUpload.addEventListener('click', eventClickFire.bind(null, jsgamFile), false);
jsgamFile.addEventListener('change', uploadJSON, false);
jgameClear.addEventListener('click', clearJSON, false);
