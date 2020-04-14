function fnt2xml(text){
	var bmformat="";
	bmformat+=text.replace(/=([^""\s]+)/gm,"=\"$1\"");
  var lines = bmformat.split('\n');
  let result = '<font>\n';
  lines.forEach(line => {
    line = line.trim();
    if (line.length <= 0) return;
    if (line.startsWith('page')) {
      result += '<pages>\n<' + line + '/>\n</pages>\n'
      return;
    }

    if (line.startsWith('chars')) {
      result += '<' + line + '>\n';
      return;
    }
    if(line.startsWith('kernings count')) result += '</chars>\n<'+line+'>';
    if(!line.startsWith('kernings count')) result += '<' + line + '/>\n';
  });

  result += '</kernings>\n</font>'
  return result;
}
