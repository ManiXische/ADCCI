/***************************************************************************************************
Extension Name: \\ex-sitecore-form
File: component-sitecore-form
Owner: mfouadshaheen
Version: 1.0.0
***************************************************************************************************/
var dropzone;
$(document).ready(function () {

  var rtl = $.checkSiteRTLDirection(),
  baseClass = ".ex-sitecore-form" ,
  fileCssClass = baseClass + "__input--file", 
  fileTriggers = ".input-file-trigger";
  var inputDropArea = $(fileCssClass);

  // Get file extension
  function checkFileExt(filename) {
    filename = filename.toLowerCase();
    return filename.split('.').pop();
  }
  function getExtensionIcon(ext) {
    let iconDict = {
      "doc": "icon-office-file-doc",
      "docx": "icon-office-file-doc",
      "rtf": "icon-office-file-doc",
      "pdf": "icon-office-file-pdf",
      "xlsx": "icon-office-file-xls",
      "xlx": "icon-office-file-xls",
      "zip": "icon-file-zip",
      "rar": "icon-file-rar",
      "ppsx": "icon-office-file-ppt",
      "pptx": "icon-office-file-ppt",
      "txt": "icon-office-file-txt",
      "png": "icon-picture-sun",
      "jpg": "icon-picture-sun",
      "jpeg": "icon-picture-sun",
      "any": "icon-file-empty",
    }
    return iconDict[ext] || iconDict["any"];
  }

  function validateFileUnique(file){
    if(file){
      var exists = 0;
      // validate unique file name
      $(fileCssClass).find("input[type='file']").each(function(){
          var files = this.files;
          if(files){
            for(var i = 0 ; i < files.length ; i++ ){
                if(file.name == files[i].name){
                  exists++;
                }
            }
          }
      });
      return exists == 1;
    }
    return false;
  }
  function drawFile(file){
      if(validateFileUnique(file)){

        // reset image
        $(file.previewTemplate).find(".dz-image img").attr('src', "");

        // name 
        $(file.previewTemplate).find("[data-dz-name]").html(file.name.substring(0,20) + "...");
        
        var ext = checkFileExt(file.name); // Get extension
            
        // add ext css class to element 
        $(file.previewTemplate).find(".dz-ext-overlay").remove();
        var documentType = $("<div/>", {
          "class": "dz-ext-overlay dz-ext-overlay--" + ext
        });

        documentType.append("<i class='" + getExtensionIcon(ext) + "'></i>");

        // read the file thumbnail 
        if (ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif') {
          var reader = new FileReader();
          reader.onload = function(e) {
            $(file.previewTemplate).find(".dz-image img").attr('src', e.target.result);
          }
        
          reader.readAsDataURL(file);
        }
        
        $(file.previewTemplate).append(documentType);
        
        // add ext div 
        $(file.previewTemplate).find(".dz-ext").html(ext.toUpperCase());


        // add file size 
        $(file.previewTemplate).find("[data-dz-size]").html("<strong>"+ parseFloat(file.size / 1048576).toFixed(2) +" </strong>");


        // clear btn 
        $(file.previewTemplate).find(".dz-remove").on("click" , function(){
            let preview = $(this).closest(".dz-preview");
            preview.siblings("input[type='file']").val("").change();
            preview.remove();
        });

        return true;
      }
      return false;
  }

  inputDropArea.each(function(idx , dropArea){
    var inputFiles = $(dropArea).find(fileTriggers);
    var form = $(dropArea).closest("form");

    $(inputFiles).each(function(idx , inputFile ) {
      var previewTemplate = $(dropArea).find(".preview-template").find(".dz-preview").clone();

      var input = $(inputFile).find("input[type='file']").first();
      // place for attributes 
      $(inputFile).find(fileTriggers + "__label").attr("for",  $(input).attr("id"));

      // on change this input 
      $(input).on("change" , function(e){
        $(this).siblings(".dz-preview").remove();
        let files = this.files;
        if(files && files.length){
          for(let i = 0 ; i < files.length ; i++){
            files[i].previewTemplate = previewTemplate;
            let drawen = drawFile(files[i]);
            if(drawen){
              $(inputFile).append(files[i].previewTemplate);
            }else {
              // the file name is redundant
              $(input).val("");
              var errorSpan = $(this)
              .siblings(".field-validation-valid , .field-validation-error")
              .replaceClass("field-validation-valid","field-validation-error");

              var errorText = $("<span></span>").text( rtl  ? "اسم الملف موجود مسبقا" : "The file name is exists");
              errorText.appendTo(errorSpan);

            }
          }
        }else {
          $(this).siblings(".field-validation-error").empty()
        }
      });      
    });
  });
});