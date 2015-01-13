(function() {

function tagsi(id) {
  var wrap = function (toWrap, wrapper) {
      wrapper = wrapper || document.createElement('div');
      if (toWrap.nextSibling) {
          toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
      } else {
          toWrap.parentNode.appendChild(wrapper);
      }
      return wrapper.appendChild(toWrap);
  };

  if (!String.prototype.trim) {
    (function() {
      // Вырезаем BOM и неразрывный пробел
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }

  function addTag(name) {
    var tag = document.createElement('SPAN');
    tag.innerHTML = name + ' <span>&times;</span>';
    tag.className = 'tagsi-item';
    //tag.setAttribute('data-name', val);
    tag.onclick = (function(v) {
      return function() {
        var fakeInputItems = fakeInput.value.split(', ');
        var newItems = [];

        for (var i=0,len=fakeInputItems.length; i<len; i++) {
          if (fakeInputItems[i] != v && String(fakeInputItems[i]).trim() != '') {
            newItems.push(fakeInputItems[i]);
          }
        }

        fakeInput.value = newItems.join(', ');
        this.parentNode.removeChild(this);
      };
    })(name);
    tagsCont.appendChild(tag);

    var fakeInputItems = fakeInput.value.split(', ');
    var newItems = [];
    
    fakeInputItems.push(name);

    for (var i=0,len=fakeInputItems.length; i<len; i++) {
      fakeInputItems[i] = String(fakeInputItems[i]).trim();
      if (fakeInputItems[i] != '') {
        newItems.push(fakeInputItems[i]);
      }
    }
    fakeInput.value = newItems.join(', ');
  }

  if (typeof id === 'string') { 
    var input = document.getElementById(id);
  } else {
    var input = id;
  }
  
  var wrapper = document.createElement('label');
  var tagsCont = document.createElement('SPAN');
  tagsCont.className = 'tagsi-list';
  var fakeInput = document.createElement('INPUT');
  fakeInput.type = 'text';
  fakeInput.name = input.name;
  fakeInput.style.display = 'none';
  input.name = '';

  var lastChar = false;

  input.setAttribute('autocomplete', 'off');
  input.setAttribute('maxlength', '1000');

  var removeLastTag = function() {
    var fakeInputItems = fakeInput.value.split(', ');
    fakeInputItems.splice(-1,1);
    fakeInput.value = fakeInputItems.join(', ');
    var lastNode = tagsCont.childNodes[tagsCont.childNodes.length-1];

    if (lastNode) {
      tagsCont.removeChild(lastNode);
    }
  };

  wrapper.className = 'tagsi';

  input.onkeydown = function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
    }

    lastChar = false;

    if (event.keyCode === 8) {
      if (this.value.length === 1) {
        lastChar = true;
      }
    }
  };

  input.onfocus = function() {
    try {
      this.parentNode.classList.add('tagsi-active');
    } catch(e) {}
  };

  input.onblur = function() {
    try {
      this.parentNode.classList.remove('tagsi-active');
    } catch(e) {}

    var v = String(input.value).trim();
    
    if (v.length === 0) {
      input.value = '';
      return;
    }

    addTag(v);
    input.value = '';
  };

  input.onkeyup = function(event) {
      var val = this.value;
      var fakeInputItems;
      
      if (event.keyCode === 8 && val === '' && !lastChar) {
        event.preventDefault();
        event.stopPropagation();

        removeLastTag();
        return;
      }
      
      if (event.keyCode !== 13 && val.indexOf(',') === -1) {
          return;
      }

      if (event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (val.indexOf(',') !== -1) {
          val = val.substring(0,val.length-1);
          var items = val.split(',');
          
          for (var i=0,len=items.length; i<len; i++) {
            var v = String(items[i]).trim();
            addTag(v);
          }
          
          this.value = '';
          return;
      }
      
      addTag(val);
      this.value = '';
  };

  wrap(input, wrapper);

  input.parentNode.insertBefore(tagsCont, input);

  wrapper.appendChild(fakeInput);
}

// exports
if (typeof module !== 'undefined') {
  module.exports = tagsi;
} else {
  this.tagsi = tagsi;
}

})();
