
(function() {
  "use strict";

  var panel;
  var timer;

  window.addEventListener("load", main);

  function main() {
    panel = 0;
    buttonActions();

    window.addEventListener("scroll", function() {
    	if(timer) {
    		window.clearTimeout(timer);
    	}

    	timer = window.setTimeout(function() {
        scrollAction();
    	}, 100);
    });
  }

  function scrollAction(){
    var offset = window.pageYOffset;
    var height = window.innerHeight;

    var overview_height = document.getElementById("overview").clientHeight;
    var project_height = document.getElementById("project").clientHeight;
    var gallery_height = document.getElementById("gallery").clientHeight;
    var footer_height = document.querySelector("footer").clientHeight;



    if(offset < height/2) {
      panel = 0; //main page
    }else if (offset >= height / 2 && offset < 0.5 * height + overview_height){
      panel = 1; //overview
    }else if (offset >= 0.5 * height + overview_height && offset < 0.5 * height + overview_height + project_height) {
      panel = 2; //project
    }else if (offset >= 0.5 * height + overview_height + project_height && offset < 0.5 * height + overview_height + project_height + gallery_height) {
      panel = 3; //gallery
    }else if (offset >= 0.5 * height + overview_height + project_height + gallery_height < 0.5 * height + overview_height + project_height + gallery_height + footer_height) {
      panel = 4; //footer
    }
  }

  function buttonActions(){
    var upbtn = document.getElementById("uparrow");
    var downbtn = document.getElementById("downarrow");

    upbtn.addEventListener("click", function(e){
        if(panel === 0){
          //do nothing
        }else if (panel === 1){
          panel = 0;
          window.location.hash = "panel0";
        }else if (panel === 2){
          panel = 1;
          window.location.hash = "panel1";
        }else if (panel === 3){
          panel = 2;
          window.location.hash = "panel2";
        }else if (panel === 4){
          panel = 3;
          window.location.hash = "panel3";
        }
    });

    downbtn.addEventListener("click", function(e){
        if(panel === 0){
          panel = 1;
          window.location.hash = "panel1";
       }else if (panel === 1){
          panel = 2;
          window.location.hash = "panel2";
        }else if (panel === 2){
          panel = 3;
          window.location.hash = "panel3";
        }else if (panel === 3){
          panel = 4;
          window.location.hash = "panel4";
        }
    });
  }


  /*********************************************
    
                  TYPING ANIMATION

   ********************************************/
  // List of sentences
  var _CONTENT = [ 
    "Full Stack Software Engineer", 
    "Programmer", 
    "Innovator",
    "Student",
    "Dreamer",
    "Maker", 
    "Achiever"
  ];

  // Current sentence being processed
  var _PART = 0;

  // Character number of the current sentence being processed 
  var _PART_INDEX = 0;

  // Holds the handle returned from setInterval
  var _INTERVAL_VAL;

  // Element that holds the text
  var _ELEMENT = document.querySelector("#text");

  // Cursor element 
  var _CURSOR = document.querySelector("#cursor");

  // Implements typing effect
  function Type() { 
    // Get substring with 1 characater added
    var text =  _CONTENT[_PART].substring(0, _PART_INDEX + 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX++;

    // If full sentence has been displayed then start to delete the sentence after some time
    if(text === _CONTENT[_PART]) {
      // Hide the cursor
      _CURSOR.style.display = 'none';

      clearInterval(_INTERVAL_VAL);
      setTimeout(function() {
        _INTERVAL_VAL = setInterval(Delete, 50);
      }, 1000);
    }
  }

  // Implements deleting effect
  function Delete() {
    // Get substring with 1 characater deleted
    var text =  _CONTENT[_PART].substring(0, _PART_INDEX - 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX--;

    // If sentence has been deleted then start to display the next sentence
    if(text === '') {
      clearInterval(_INTERVAL_VAL);

      // If current sentence was last then display the first one, else move to the next
      if(_PART == (_CONTENT.length - 1))
        _PART = 0;
      else
        _PART++;
      
      _PART_INDEX = 0;

      // Start to display the next sentence after some time
      setTimeout(function() {
        _CURSOR.style.display = 'inline-block';
        _INTERVAL_VAL = setInterval(Type, 100);
      }, 200);
    }
  }

  // Start the typing effect on load
  _INTERVAL_VAL = setInterval(Type, 100);

   /*********************************************
    
                    ANGLE DOWN

   ********************************************/
  var down_arrow = document.querySelector(".arrow");
  down_arrow.addEventListener("click", function(){
    panel = 1;
    window.location.hash = "panel1";
  });


  /*********************************************
    
                      CAROUSEL

   ********************************************/

  var currentImg = 0;
  var gallery_img = ["gallery_img/img0.jpeg", "gallery_img/img1.jpeg", "gallery_img/img2.jpeg", 
                     "gallery_img/img3.jpeg", "gallery_img/img4.jpeg", "gallery_img/img5.jpeg",
                     "gallery_img/img6.jpeg", "gallery_img/img7.jpeg", "gallery_img/img8.jpeg",
                     "gallery_img/img9.jpeg", "gallery_img/img10.jpeg", "gallery_img/img11.jpeg",
                     "gallery_img/img12.jpeg", "gallery_img/img13.jpeg", "gallery_img/img14.jpeg", 
                     "gallery_img/img15.jpeg"];
  
  var carousel = document.querySelector('.carousel');
  var cells = carousel.querySelectorAll('.carousel__cell');
  var cellCount; // cellCount set from cells-range input value
  var selectedIndex = 0;
  var cellWidth = carousel.offsetWidth;
  var cellHeight = carousel.offsetHeight;
  var isHorizontal = true;
  var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
  var radius, theta;
  // console.log( cellWidth, cellHeight );
  
  function rotateCarousel() {
    var angle = theta * selectedIndex * -1;
    carousel.style.transform = 'translateZ(' + -radius + 'px) ' + 
      rotateFn + '(' + angle + 'deg)';
  }
  
  var prevButton = document.querySelector('.previous-button');
  prevButton.addEventListener( 'click', function() {
    selectedIndex--;
    rotateCarousel();
  });
  
  var nextButton = document.querySelector('.next-button');
  nextButton.addEventListener( 'click', function() {
    selectedIndex++;
    rotateCarousel();
  });
  
  var cellsRange = document.querySelector('.cells-range');
  cellsRange.addEventListener( 'change', changeCarousel );
  cellsRange.addEventListener( 'input', changeCarousel );
  
  function changeCarousel() {
    cellCount = cellsRange.value;
    theta = 360 / cellCount;
    var cellSize = isHorizontal ? cellWidth : cellHeight;
    radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / cellCount ) );
    for ( var i=0; i < cells.length; i++ ) {
      var cell = cells[i];
      if ( i < cellCount ) {
        // visible cell
        cell.style.opacity = 1;
        var cellAngle = theta * i;
        cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
      } else {
        // hidden cell
        cell.style.opacity = 0;
        cell.style.transform = 'none';
      }
    }
  
    rotateCarousel();
  }
  
  var orientationRadios = document.querySelectorAll('input[name="orientation"]');
  ( function() {
    for ( var i=0; i < orientationRadios.length; i++ ) {
      var radio = orientationRadios[i];
      radio.addEventListener( 'change', onOrientationChange );
    }
  })();
  
  function onOrientationChange() {
    var checkedRadio = document.querySelector('input[name="orientation"]:checked');
    isHorizontal = checkedRadio.value == 'horizontal';
    rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
    changeCarousel();
  }
  
  // set initials
  onOrientationChange();

    
  /*********************************************
    
                      MODAL

   ********************************************/
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  //var img = document.getElementById("myImg");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  /*
  img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  }
  */

  // Get the <span> element that closes the modal
  var close = document.getElementsByClassName("close")[0];
  close.onclick = function() {
    modal.style.display = "none";
  }

  //next img
  var nextImg = document.getElementsByClassName("nextImg")[0];
  nextImg.onclick = function() {
    getRightImage();
  }
  //prev img
  var prevImg = document.getElementsByClassName("prevImg")[0];
  prevImg.onclick = function() {
    getLeftImage();
  }

  function getRightImage(){
    if (currentImg == cellCount - 1) currentImg = -1;
    modalImg.src = gallery_img[++currentImg];
  }
  function getLeftImage(){
    if (currentImg == 0) currentImg = cellCount;
    modalImg.src = gallery_img[--currentImg];
  }

  document.addEventListener("keydown", function(e) {
    switch(e.which) {
        case 37: // left
            getLeftImage();
        break;

       case 39: // right
            getRightImage();
       break;

       default: return; 
    }
    e.preventDefault(); 
  });

  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    cell.onclick = function(index){
      return function(){
        modal.style.display = "block";
        modalImg.src = gallery_img[index];
        //captionText.innerHTML = this.alt;
        /*
        var style = cell.currentStyle || window.getComputedStyle(cell, false),
        bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
        */
      };
    }(i);
  }

  /*
  // Get the image id, style and the url from it
  var ximg = document.getElementById('testdiv'),
  xstyle = ximg.currentStyle || window.getComputedStyle(ximg, false),
  bi = xstyle.backgroundImage.slice(4, -1).replace(/"/g, "");

  // Display the url to the user
  console.log('Image URL: ' + bi);
  */
  
})();
