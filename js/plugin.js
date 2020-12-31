// Home Page

//change img of items
function imgSlider(item){
    document.querySelector(".sofa").src = item;
}
//change background color
function changeBgColor(color){
    const section = document.querySelector(".main-container");
    section.style.background = color;
} 

//Contact Us page

//focus function
const inputs = document.querySelectorAll(".input");

function focusFunc(){
    let parent = this.parentNode;
    parent.classList.add("focus");
}
function blurFunc(){
  let parent = this.parentNode;
    if(this.value ==="") {
        parent.classList.remove("focus");
    }
}

inputs.forEach(input =>{
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);

})