var importPlayer=false;
var importNPC=false;
var importFont=false;
var removeSources=false;
// Initialize the editor

var editor = new JSONEditor(document.getElementById('editor_holder'),{
  // Enable fetching schemas via ajax
  ajax: true,
  iconlib : 'fontawesome5',
  no_additional_properties: true,
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
    indicator.style.color="red";
  }
  // Valid
  else {
    indicator.classList.remove("fa-times","text-error");
    indicator.classList.add("fa-check","text-sucess");
    indicator.dataset.tooltip="Valid";
    indicator.style.color="green";
  }
});

editor.on('ready',() => {
  // Now the api methods will be available
  editor.validate();
  setEditorStyle();
});

function addClasses(tag,classes){
  Array.from(document.querySelectorAll(tag)).forEach(
    el=>{
      classes.forEach(
        clase=>{
          el.classList.add(clase);
        }
      )

    }

  );
}
function setEditorStyle(){
  addClasses('button',["siimple-btn", "siimple-btn--dark"]);
  addClasses('input',["siimple-input", "siimple-input--fluid"]);
}

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
   var editorJSON=editor.getValue();
   if(removeSources) delete editorJSON["Sources"];
   removeSources=false;

   if (title === null) return;

   var json = editorJSON,
       filename = (title || 'jsgam').toLowerCase().replace(/[\s<>:"\\|*]/g, "-") + '.json',
       blob = new Blob([JSON.stringify(json, null, 2)], {type: "application/json;charset=utf-8"});

   var a = document.createElement('a');
   a.download = filename;
   a.href = URL.createObjectURL(blob);
   a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
   eventClickFire(a);
 };

 //Export JSON
 function exportJSON(){
   removeSources=true;
   downloadJSON();
 }

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
      editor.setValue(parseJson(response)); //Temporal fix for don't applying values to the form correctly
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
     console.log(adventure,parseJson(response));
     editor.setValue(Object.assign(adventure,parseJson(response)));//Merge imported JSON with existing values
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
     else if(importNPC) setNPC(file.name,parseJson(response));
     else if(importFont) setFont(response);
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
    adventure.setValue(currentSrc.concat(Object.getOwnPropertyNames(sources.frames)));
  }
}

function setFont(sources){
  importFont=false;
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(sources,"text/xml");
  let fntInfo=xmlDoc.getElementsByTagName("info")[0];

  if(fntInfo){
    let fontValues=fntInfo.attributes["face"].nodeValue;
    let adventure=editor.getEditor('root.Sources.Fonts')
    var currentSrc=adventure.getValue();
    adventure.setValue(currentSrc.concat(fontValues));
  }
  /*
  var adventure;
  if(sources.frames){
    adventure=editor.getEditor('root.Sources.Images')
    var currentSrc=adventure.getValue();
    adventure.setValue(currentSrc.concat(Object.getOwnPropertyNames(sources.frames)));
  }*/
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

function setNPC(name,data){
  importNPC=false;
  let folder=editor.getEditor('root.Sources.Folders').getValue();
  let path=folder.Main;
  if(folder.Characters!==undefined) path=folder.Characters;
  let characterSettings=editor.getEditor('root.Characters');
  if(characterSettings!==undefined){
    let nameJson=name.replace("ske", "tex");
    let nameTex=nameJson.replace("json", "png")
    let characterObj={
      Skeleton:path+name,
      Texture:path+nameTex,
      Json:path+nameJson,
      Armature:data.armature[0].name
    }

    var currentCharacters=characterSettings.getValue();
    characterSettings.setValue(currentCharacters.concat(characterObj));
  }
}

var clearJSON=function(){
  editor.setValue("{}");
}

function fileUpload(){
  document.querySelector('#uploadFile').click();
}
function setupButtons(){
  //Save Adventure
  document.getElementById("download").addEventListener('click',downloadJSON);

  //Export Adventure
  document.getElementById("export").addEventListener('click',exportJSON);

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



  document.querySelectorAll('[aria-label="Close"]').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelector("#resetConfirm").classList.remove("active");
    })
  });

  document.querySelector("#resetYes").addEventListener('click',clearJSON);

  //Add sources
  document.getElementById("addsrc").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
  });

  //Add fonts
  document.getElementById("addfnt").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importFont=true;
  });

  //Add Player
  document.getElementById("addplayer").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importPlayer=true;
  });

  //Add Character
  document.getElementById("addcharacter").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importNPC=true;
  });

  document.getElementById("srcFile").addEventListener('change',importSources);
}

setupButtons();
