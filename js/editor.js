var importPlayer=false;
var importPartner=false;
var importNPC=false;
var importFont=false;
var importSound=false;
var importAdventure=false;
var importScene=false;
var convertFont=false;
var minify=false;

function setSources(sources,file){
  var adventure;
  adventure=editor.getEditor('root.Sources.Images');
  var currentSrc=adventure.getValue();
  if(sources.frames){
    let framesArray=Object.getOwnPropertyNames(sources.frames);
    let mergedArray=currentSrc.concat(framesArray); //Merge with current sources
    currentSrc=mergedArray.filter((a, b) => mergedArray.indexOf(a) === b); //Remove doubles
    adventure.setValue(currentSrc.sort());
  }else if(file!==undefined){
    let mergedArray=currentSrc.concat(file); //Merge with current sources
    currentSrc=mergedArray.filter((a, b) => mergedArray.indexOf(a) === b); //Remove doubles
    adventure.setValue(currentSrc.sort());
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

function setPartner(name,data){
  importPartner=false;
  let folder=editor.getEditor('root.Sources.Folders').getValue();
  let path=folder.Main;
  if(folder.NPC!==undefined) path=folder.NPC;
  let partnerSettings=editor.getEditor('root.Partner');
  let nameJson=name.replace("ske", "tex");
  let nameTex=nameJson.replace("json", "png")
  let partnerObj={
    Name:data.armature[0].name,
    Skeleton:path+name,
    Texture:path+nameTex,
    Json:path+nameJson,
    Armature:data.armature[0].name
  }
  if(partnerSettings) partnerSettings.setValue(partnerObj);
}

function setNPC(name,data){
  importNPC=false;
  let folder=editor.getEditor('root.Sources.Folders').getValue();
  let path=folder.Main;
  if(folder.NPC!==undefined) path=folder.NPC;
  let characterSettings=editor.getEditor('root.Characters');
  if(characterSettings!==undefined){
    let nameJson=name.replace("ske", "tex");
    let nameTex=nameJson.replace("json", "png")
    let characterObj={
      Name:data.armature[0].name,
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
  response=response.replace(/\\n/g,">").replace(/0x/g,"#");//Convert break lines
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
  localStorage.removeItem('JSGAM-Autosave');
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

  //Add Partner
  document.getElementById("addpartner").addEventListener('click',()=>{
    document.getElementById("srcFile").click();
    importPartner=true;
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
