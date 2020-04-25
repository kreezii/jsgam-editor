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
var saveJSON = function() {
 let space=2;
 var editorJSON=JSON.parse(JSON.stringify(editor.getValue())); //Clone object so we don't modify the editor values
 var adventureTitle=editorJSON["Sources"].Filename;
 var title = prompt('Enter the name of your file', adventureTitle);
 if(minify){
   delete editorJSON["Sources"]; //That's why we cloned the editor object
   space=0;
   minify=false;
 }
 if (title === null) return;

 var json = JSON.stringify(editorJSON, null, space).replace(/>/g,"\\n");//Convert break lines
 var filename = (title || 'jsgam').toLowerCase().replace(/[\s<>:"\\|*]/g, "-") + '.json';
 var blob = new Blob([json], {type: "application/json;charset=utf-8"});

 var a = document.createElement('a');
 a.download = filename;
 a.href = URL.createObjectURL(blob);
 a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
 eventClickFire(a);
};

//Save Converted Font
function saveFont(fntText){
  convertFont=false;
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(fntText,"text/xml");
  let fntInfo=xmlDoc.getElementsByTagName("info")[0];
  let fontValues=fntInfo.attributes["face"].nodeValue;
	var title = prompt('Enter the name of your file', fontValues);
	var filename = (title || 'font').toLowerCase().replace(/[\s<>:"\\|*]/g, "-") + '.fnt';
   var    blob = new Blob([fntText], {type: "application/xml;charset=utf-8"});
     var a = document.createElement('a');
   a.download = filename;
   a.href = URL.createObjectURL(blob);
   a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
   eventClickFire(a);
}

//Export JSON
function exportJSON(){
 minify=true;
 saveJSON();
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
      editor.setValue(parseJson(response)); //Apply twice
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
     editor.setValue(Object.assign(adventure,parseJson(response)));//Merge imported JSON with existing values
   };
   reader.readAsText(file)
 }

};

//Import Files
var importFile = function(e) {
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
     else if(importSound) setSound(file.name);
     else if(importAdventure) setAdventure(response);
     else if(importScene) setScene(response);
     else if(convertFont) saveFont(fnt2xml(response));
     else setSources(parseJson(response));
   };
   reader.readAsText(file)
 }
};
