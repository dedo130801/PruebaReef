
var imageStringBase64 = null;
var imageName = null;
function encodeImageFileBase64(idInputFile){
  var filesSelected = document.getElementById(idInputFile).files;
  if (filesSelected.length > 0){
    var fileToLoad = filesSelected[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
      var newImage = document.createElement('img');
      imageStringBase64 = fileLoadedEvent.target.result;
      var fullPath = document.getElementById(idInputFile).value;
      imageName = fullPath.split(/(\\|\/)/g).pop();
      newImage.src = imageStringBase64;
      document.getElementById("imgUpload").innerHTML = newImage.outerHTML;
    }
    fileReader.readAsDataURL(fileToLoad);
  }
}