var importPlayer=false;
// Initialize the editor

var editor = new JSONEditor(document.getElementById('editor_holder'),{
  // Enable fetching schemas via ajax
  ajax: true,
  theme: 'spectre',
  iconlib : 'fontawesome5',
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

  var indicator = document.getElementById('valid_icon');

  // Not valid
  if(errors.length) {
    indicator.classList.remove("fa-check","text-sucess");
    indicator.classList.add("fa-times","text-error");
    indicator.dataset.tooltip="Error";
  }
  // Valid
  else {
    indicator.classList.remove("fa-times","text-error");
    indicator.classList.add("fa-check","text-sucess");
    indicator.dataset.tooltip="Valid";
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

   var a = document.createElement('a');
   a.download = filename;
   a.href = URL.createObjectURL(blob);
   a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
   eventClickFire(a);
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
    };
    reader.readAsText(file)
  }

};

//Import JSON
var importJSON = function(e) {
 e.preventDefault();
 var files = e.target.files || e.dataTransfer.files;
 if (files.length !== 0) {
   var file = files[0];

   var reader = new FileReader();
   reader.onload = function(e) {
     var response = e.target.result;
     var adventure=editor.getValue();
     editor.setValue($.extend( true, adventure, parseJson(response))); //Merge imported JSON with existing values
   };
   reader.readAsText(file)
 }

};

//Import Sources
var importSources = function(e) {
 e.preventDefault();
 var files = e.target.files || e.dataTransfer.files;
 if (files.length !== 0) {
   var file = files[0];

   var reader = new FileReader();
   reader.onload = function(e) {
     var response = e.target.result;
     if(importPlayer) setPlayer(file.name,parseJson(response));
     else setSources(parseJson(response));
   };
   reader.readAsText(file)
 }

};

function setSources(sources){
  var adventure;
  if(sources.frames){
    adventure=editor.getEditor('root.Sources.Images')
    var currentSrc=adventure.getValue();
    adventure.setValue($.merge(currentSrc,Object.getOwnPropertyNames(sources.frames)));
  }
}

function setPlayer(name,data){
  importPlayer=false;
  let folder=editor.getEditor('root.Sources.Folders').getValue();
  let path=folder.Main;
  if(folder.Player!==undefined) path=folder.Player;
  let playerSettings=editor.getEditor('root.Player');
  let nameJson=name.replace("ske", "tex");
  let nameTex=nameJson.replace("json", "png")
  let playerObj={
    Skeleton:path+name,
    Texture:path+nameTex,
    Json:path+nameJson,
    Armature:data.armature[0].name
  }
  playerSettings.setValue(playerObj);
}

var clearJSON=function(){
  editor.setValue("{}");
}

function fileUpload(){
  document.querySelector('#uploadFile').click();
}

//Save Adventure
document.getElementById("download").addEventListener('click',downloadJSON);

//Load Adventure
document.getElementById("upload").addEventListener('click',()=>{
  document.getElementById("uploadFile").click();
});
document.getElementById("uploadFile").addEventListener('change',uploadJSON);

//Import Scene
document.getElementById("import").addEventListener('click',()=>{
  document.getElementById("importFile").click();
});
document.getElementById("importFile").addEventListener('change',importJSON);

//Reset Adventure
document.querySelector("#reset").addEventListener('click',()=>{
  document.querySelector("#resetConfirm").classList.add("active");
});

document.querySelector("#closeReset").addEventListener('click',()=>{
  document.querySelector("#resetConfirm").classList.remove("active");
});

document.querySelector("#resetYes").addEventListener('click',clearJSON);

//Add sources
document.getElementById("srcFile")
/*
  $('#addsrc').click(function(){$('#srcFile').click();});
  $('#addplayer').click(function(){$('#srcFile').click();importPlayer=true;});
  $('#srcFile').change(importSources);
  $('#reset').click(clearJSON);
*/
