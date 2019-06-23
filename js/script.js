/*jshint esversion: 8 */
window.addEventListener('DOMContentLoaded', () => {
  
  //load data from db
  const loadData = async (url, callback) => {
    await fetch(url)
      .then(response => response.json())
      .then(json => showData(json.goods)); // console.log(json)
    callback();
  };
  // buttons sort
  document.querySelector('#sort-asc').onclick = function(){
	  mySort('data-price');
  }
  document.querySelector('#sort-desc').onclick = function(){
	  mySortDesc('data-price');
  }
  document.querySelector('#sort-rating').onclick = function(){
	  mySortDesc('data-rating');
  }
  
  let nav = document.querySelector('.goods__wrapper');
  // functions sort asc
  
  function mySort(sortType){
	  //let nav = document.querySelector('.goods__wrapper');
	  for(let i=0; i < nav.children.length; i++){
		  for(let j=i; j < nav.children.length; j++){
			  if(+nav.children[i].getAttribute(sortType) > +nav.children[j].getAttribute(sortType)){
				replacedNode = nav.replaceChild(nav.children[j], nav.children[i]);
				insertAfter(replacedNode, nav.children[i]);
			  }
		  }
	  }
  } 
  // function sort desc and rating
  function mySortDesc(sortType){
	  //let nav = document.querySelector('.goods__wrapper');
	  for(let i=0; i < nav.children.length; i++){
		  for(let j=i; j < nav.children.length; j++){
			  if(+nav.children[i].getAttribute(sortType) < +nav.children[j].getAttribute(sortType)){
				replacedNode = nav.replaceChild(nav.children[j], nav.children[i]);
				insertAfter(replacedNode, nav.children[i]);
			  }
		  }
	  }
  }
  
  function insertAfter(elem, refElem){
	  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
  }
  
  
  
  

  //create HTML and put it on the page
  function showData(arr) {
    const goodsWrapper = document.querySelector('.goods__wrapper');

    arr.forEach((item) => {
		
      let card = document.createElement('div');

      card.classList.add('goods__item');
      card.setAttribute('data-price', ''+item.price+'');
      card.setAttribute('data-rating', ''+item.rating+'');      
     
      card.innerHTML = `
        <img class="goods__img" src="${item.url}" alt="phone">
        <div class="goods__colors">Рейтинг: ${item.rating}</div>
        <div class="goods__title">
          ${item.title}
        </div>
        <div class="goods__price">
          <span>${item.price}</span> руб/шт
        </div>
        <button class="goods__btn">Добавить</button>
      `;
      goodsWrapper.appendChild(card);
    });
  }

  loadData('js/db.json', () => {
    
    const cartWrapper = document.querySelector('.cart__wrapper'),
      cartBody = document.querySelector('.cart__body'),
      cart = document.querySelector('.cart'),
      //кнопка зарытия корзины
      cartClose = document.querySelector('.cart__close'),
      //кнопка открытия корзины
      cartOpen = document.querySelector('#cart'),
      //общая стоимость товаров в корзине
      cartTotalCost = document.querySelector('.cart__total > span'),
      //иконка корзины для анимации подтверждения добавления в корзину
      aniCartIcon = document.querySelector('.confirm'),
      //бэджик на иконке корзины для показа количества товаров в корзине
      badge = document.querySelector('.nav__badge'),

      goodsButtons = document.querySelectorAll('.goods__btn'),
      goods = document.querySelectorAll('.goods__item'),
      titles = document.querySelectorAll('.goods__title');

    function showCart() {
      
      cart.style.display = 'block';
      //block page scrolling
      document.body.style.overflow = 'hidden';
    }

    function hideCart() {
      cart.style.display = 'none';
      //let page scrolling
     document.body.style.overflow = '';
    }

    cartOpen.addEventListener('click', showCart);
    cartClose.addEventListener('click', hideCart);

    goodsButtons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        let item = goods[i].cloneNode(true),          
          btnAdd2Cart = item.querySelector('button'),          
          removeBtn = document.createElement('div'),         
          emptyText = cartWrapper.querySelector('.empty');
          btnCartConfirm = cartBody.querySelector('.cart__confirm');
		          
       
			btnAdd2Cart.remove();
        
			showCartIconAnimation();
        
			removeBtn.classList.add('goods__item-remove');
			removeBtn.innerHTML = '&times';
			item.appendChild(removeBtn);

        
			if (emptyText) {
				emptyText.style.display = 'none';		  
				//emptyText.remove();		  
			}
			//add Item into cart	
			cartWrapper.appendChild(item);			
			//update counter
			countCartGoods();
			//update sum
			countCartTotalPrice();
			
			removeBtn.addEventListener('click', () => {
				item.remove();
				countCartGoods();
				countCartTotalPrice();
				if (cartWrapper.querySelectorAll('.goods__item').length == 0){
					//cartWrapper.appendChild(emptyText);
					emptyText.style.display = 'block';
					btnCartConfirm.style.display = 'none';
				}
			});

      });
    });

    
    //cut item's description
    function sliceAllTitles() {
      titles.forEach((item) => {
        const strLength = 50;
        let str = item.textContent.trim();
        if (str.length > strLength) {
          item.textContent = `${str.slice(0, strLength)}...`;
        }
      });
    }
    sliceAllTitles();

    //show animation
    function showCartIconAnimation() {
      aniCartIcon.style.display = 'block';      
      let counter = 10;
      const animation = setInterval(frame, 10);

      function frame() {
        if (counter < 100) {
          aniCartIcon.style.transform = `translateY(-${counter}px)`;
          aniCartIcon.style.opacity = `.${110 - counter}`;
          counter++;
        } else {
          clearInterval(animation);
          aniCartIcon.style.display = 'none';
        }
      }
    }

    //cart badge counter
    function countCartGoods() {
      badge.textContent = cartWrapper.querySelectorAll('.goods__item').length;
    }

    //total price
    function countCartTotalPrice() {
      const itemsPrices = cartWrapper.querySelectorAll('.goods__price > span');
      let sum = 0;
      itemsPrices.forEach((i) => {
        sum += +i.textContent; //!
      });
      cartTotalCost.textContent = sum;
    }

  });
  
  

});
