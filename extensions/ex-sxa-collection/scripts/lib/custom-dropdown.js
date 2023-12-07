
  var dropdownElemnt, i, j, selElmnt, a, b, c;
  
  $(document).ready(function () {

    $.fn.initCustomDropdown = function(){
      var dropdownElemnt = this;
      for (i = 0; i < dropdownElemnt.length; i++) {
        selElmnt = dropdownElemnt[i].getElementsByTagName("select")[0];
        /*for each element, create a new div that will act as the selected item:*/
        a = document.createElement("div");
        a.setAttribute("class", "custom-dropdown");
        var selected = selElmnt.options[selElmnt.selectedIndex];
        a.innerHTML = selected.innerHTML;
        if(selected){
          a.classList.add("custom-dropdown-hasvalue");
        }
        
        selElmnt.parentNode.insertBefore(a , selElmnt);
        /*for each element, create a new div that will contain the option list:*/
        b = document.createElement("div");
        b.setAttribute("class", "custom-dropdown-items custom-dropdown-items--hidden");
        for (j = 1; j < selElmnt.length; j++) {
          /*for each option in the original select element,
          create a new div that will act as an option item:*/
          c = document.createElement("div");
          c.innerHTML = selElmnt.options[j].innerHTML;
    
          // disabled option
          if(selElmnt.options[j].disabled){
            c.setAttribute("class", "custom-dropdown-disabled-item");
          }
          
          c.addEventListener("click", function(e) {
              /*when an item is clicked, update the original select box,
              and the selected item:*/
              var y, i, k, s, h, v;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              h = this.parentNode.previousSibling;
              v = false;
              for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                  v = true;
                  s.selectedIndex = i;
                  h.innerHTML = this.innerHTML;
                  y = this.parentNode.getElementsByClassName("custom-dropdown-selected-item");
                  for (k = 0; k < y.length; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "custom-dropdown-selected-item");
                  break;
                }
              }
    
              if(v){
                h.classList.add("custom-dropdown-hasvalue");
                this.parentNode.parentNode.classList.add("ex-sitecore-form__input--custom-dropdown--value");
    
              }else {
                h.classList.remove("custom-dropdown-hasvalue");
                this.parentNode.parentNode.classList.remove("ex-sitecore-form__input--custom-dropdown--value");
              }
              h.click();
              if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                s.dispatchEvent(evt);
              }
              else
                  s.fireEvent("onchange");
            
      
          });
          b.appendChild(c);
        }
        selElmnt.parentNode.insertBefore(b , selElmnt);
        a.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("custom-dropdown-items--hidden");
            this.classList.toggle("select-arrow-active");
          });
      }
      function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("custom-dropdown-items");
        y = document.getElementsByClassName("custom-dropdown");
        for (i = 0; i < y.length; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < x.length; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("custom-dropdown-items--hidden");
          }
        }
      }
      /*if the user clicks anywhere outside the select box,
      then close all select boxes:*/
      document.addEventListener("click", closeAllSelect);
  
      return this;
    }

    $(".ex-sitecore-form__input--custom-dropdown").initCustomDropdown();

});

