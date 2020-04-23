var importPlayer=false;
var importNPC=false;
var importFont=false;
var importSound=false;
var importAdventure=false;
var importScene=false;
var convertFont=false;
var minify=false;

function setSources(sources){
  var adventure;
  if(sources.frames){
    adventure=editor.getEditor('root.Sources.Images')
    var currentSrc=adventure.getValue();
    adventure.setValue(currentSrc.concat(Object.getOwnPropertyNames(sources.frames)));
  }
}

function setSound(name){
  importSound=false;
  let adventure=editor.getEditor('root.Sources.Audio');
  var currentSrc=adventure.getValue();
  adventure.setValue(currentSrc.concat(name));
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

function setAdventure(response){
  importAdventure=false;
  editor.setValue(parseJson(response));
  editor.setValue(parseJson(response)); //Apply twice
}

function setScene(response){
  importScene=false;

  var importedScene=parseJson(response);

  //Append objects
  var objects=editor.getEditor('root.Objects');
  var objectsList=objects.getValue();
  objects.setValue(objectsList.concat(importedScene.Objects));

  //Append Scenes
  var scenes=editor.getEditor('root.Scenes');
  var sceneList=scenes.getValue();
  scenes.setValue(sceneList.concat(importedScene.Scenes));
}

//Clear Adventure
function clearJSON(){
  editor.setValue("{}");
}

function setupEditor(){
  //Save Adventure
  document.getElementById("download").addEventListener('click',saveJSON);

  //Export Adventure
  document.getElementById("export").addEventListener('click',exportJSON);

  //Load Adventure
  document.getElementById("upload").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importAdventure=true;
  });
  //document.getElementById("uploadFile").addEventListener('change',uploadJSON);

  //Import Scene
  document.getElementById("import").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importScene=true;
  });
//  document.getElementById("importFile").addEventListener('change',importJSON);

  //Reset Adventure
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

  //Add font format
  document.getElementById("convertfont").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    convertFont=true;
  });

  //Add sounds
  document.getElementById("addsnd").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importSound=true;
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

  //Import Sources
  document.getElementById("srcFile").addEventListener('change',importFile);

  //Close Modals
  document.querySelectorAll('[aria-label="Close"]').forEach(el=>{
    el.addEventListener('click',()=>{
      document.querySelector("#resetConfirm").classList.remove("active");
    })
  });
}
