
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

function validateAdventure(){
  // Get an array of errors from the validator
  var errors = editor.validate();

  var indicator = document.getElementById('valid_icon');

  // Not valid
  if(errors.length) {
    indicator.classList.remove("fa-check","text-sucess");
    indicator.classList.add("fa-times","text-error");
    indicator.title="Error";
    indicator.style.color="red";
  }
  // Valid
  else {
    indicator.classList.remove("fa-times","text-error");
    indicator.classList.add("fa-check","text-sucess");
    indicator.title="No errors found";
    indicator.style.color="green";

    //Autosave
    localStorage.setItem('JSGAM-Autosave', JSON.stringify(editor.getValue(), null, 2));
  }
}

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change',function() {
  validateAdventure();
});

editor.on('ready',() => {
  let autosave=localStorage.getItem('JSGAM-Autosave');

  if(autosave){
    editor.setValue(parseJson(autosave));
    editor.setValue(parseJson(autosave)); //Apply twice
  }

  // Now the api methods will be available
  validateAdventure();
});

setupEditor();
