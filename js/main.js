// select variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");


//cart
let cart =[];
//buttons
let buttonsDOM =[];

//Getting the Products from json object
class Products{
async getProducts(){
    try{
    //get json file
    let result = await fetch('products.json');
    //get json file items
    let data = await result.json();  
    // get products details from items array
    let products = data.items;

    products = products.map(item =>{

        //items display as array items : 
        const{title,price} = item.fields;
        const{id} =item.sys;
        const image = item.fields.image.fields.file.url;

       //item title - item price - item id - item img
        return {title,price,id,image}
    });

    return products;

    }catch(error){
    console.log(error);
    }
}
}

//Display products
class UI{
    displayProducts(products){
    let result = "";
    //loop for every product you have in products array
    products.forEach(product =>{
        result+=`
                     <!----single product----->
             <article class="product">
                 <div class="img-container">
                     <img src= ${product.image} alt="product"class="product-img"/>
                     <button class="bag-btn"data-id=${product.id}>
                         <i class="fas fa-shopping-cart"></i>
                           add to cart
                     </button>
                 </div>
                 <h3>${product.title}</h3>
                 <h4>$${product.price}</h4>
             </article>
            <!---- end of single product----->

        `
    });
    productsDom.innerHTML = result;
    }
getBagButtons(){
  const buttons = [...document.querySelectorAll(".bag-btn")];
  buttonsDOM = buttons;
  buttons.forEach(button =>{
      let id = button.dataset.id;
      let inCart = cart.find(item =>item.id === id);
      if(inCart){
          button.innerText = "In Cart";
          button.disabled = true;
      }
          button.addEventListener("click",event =>{
              event.target.innerText ='In Cart';
              event.target.disabled = true;

                    //get product from products
      let cartItem = {...Storage.getProduct(id), amount:1};

      //add product to the cart
        cart = [...cart,cartItem];
        
      //save cart in local storage
      Storage.saveCart(cart);

      //set cart values
      this.setCartValues(cart);

      //display cart item 
      this.addCartItem(cartItem);

      //show the cart
      this.showCart();
     });
  });
}
setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item =>{
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
}

addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML =`
    <!------cart item ---->
      <img src=${item.image} alt="product"/>
                  <div>
                      <h4>${item.title}</h4>
                      <h5>$${item.price}</h5>
                      <span class="remove-item" data-id =${item.id}> remove</span>
                  </div>
                  <div>
                    <i class="fas fa-chevron-up" data-id =${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id =${item.id}></i>
                  </div> 
                  <!------ end of cart item ----->
                  `
                  cartContent.appendChild(div);
}

showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDom.classList.add('showCart');
}
setupApp(){
   cart = Storage.getCart();
   this.setCartValues(cart);
   this.populateCart(cart);
   cartBtn.addEventListener('click',this.showCart)
}
populateCart(cart){
   cart.forEach(item => this.addCartItem(item));
   closeCartBtn.addEventListener('click',this.hideCart)
}
hideCart(){
   cartOverlay.classList.remove('transparentBcg');
    cartDom.classList.remove('showCart'); 
}
cartLogic(){
     //VIP NOTE : use arrow function to acess to the class not to the button itself
    clearCartBtn.addEventListener('click',() =>{
        this.clearCart();
    }); 
    //cart functionality increase & decrease items
     cartContent.addEventListener("click",event =>{

        //remove btn in the cart
         if(event.target.classList.contains("remove-item")){
             let removeItem = event.target;
             let id = removeItem.dataset.id;
             cartContent.removeChild(removeItem.parentElement.parentElement);
             this.removeItem(id);
         }
        
         //increase the value number
         else if (event.target.classList.contains("fa-chevron-up")){
             let addAmount = event.target;
             let id = addAmount.dataset.id;
             let tempItem = cart.find(item => item.id === id);
             tempItem.amount = tempItem.amount + 1;
             Storage.saveCart(cart);
             this.setCartValues(cart);
             addAmount.nextElementSibling.innerHTML=tempItem.amount;
         }

         //decrease the value number
         else if (event.target.classList.contains("fa-chevron-down")){
             let lowerAmount = event.target;
             let id = lowerAmount.dataset.id;
             let tempItem = cart.find(item => item.id === id);
             tempItem.amount = tempItem.amount - 1;
             if(tempItem.amount > 0){
            Storage.saveCart(cart);
             this.setCartValues(cart);
             lowerAmount.previousElementSibling.innerHTML=tempItem.amount;  
             }else{
                cartContent.removeChild(lowerAmount.parentElement.parentElement);
                this.removeItem(id);
             }
            
         }
     });   
}
clearCart(){
   let cartItems = cart.map(item => item.id);
   cartItems.forEach(id => this.removeItem(id));
   while(cartContent.children.length > 0){
       cartContent.removeChild(cartContent.children[0]);
   }
   this.hideCart();
}
removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to cart`;
}
getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
}
}


//Local Storage
class Storage{
  static saveProducts(products){
      localStorage.setItem("products",JSON.stringify(products));
  }
  static getProduct(id){
      let products = JSON.parse(localStorage.getItem("products"));
      return products.find(product => product.id === id);
  }
  static saveCart(cart){
      localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart(){
      return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):[]
  }
}

document.addEventListener("DOMContentLoaded" , ()=>{
    const ui = new UI();
    const products = new Products();
//set up app
ui.setupApp();
    //getting all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
 }).then(() =>{
   ui.getBagButtons();
   ui.cartLogic();
 });
});