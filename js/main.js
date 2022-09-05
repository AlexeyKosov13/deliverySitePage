//=======headersmall======
(function () {
  if (window.matchMedia("(max-width: 992px").matches) {
    return;
  } else {
    let header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 0) {
        header.classList.add("is--active");
      } else {
        header.classList.remove("is--active");
      }
    });
  }
})();

//====popup ======

(function () {
  const body = document.querySelector("body");

  let closestAttr = (item, attr) => {
    let node = item;
    while (node) {
      let attrValue = node.getAttribute(attr);
      if (attrValue) {
        return attrValue;
      }

      node = node.parentElement;
    }
    return null;
  };

  let closestItemByClass = (item, className) => {
    let node = item;
    while (node) {
      if (node.classList.contains(className)) {
        return node;
      }

      node = node.parentElement;
    }
    return null;
  };

  const showPopup = (target) => {
    target.classList.add("is--active");
  };

  const closePopup = (target) => {
    target.classList.remove("is--active");
  };

  const toggleScroll = () => {
    body.classList.toggle("no-scroll");
  };

  body.addEventListener("click", (e) => {
    let target = e.target;
    let popupClass = closestAttr(target, "data-popup");

    if (popupClass === null) {
      return;
    }

    e.preventDefault();
    let popup = document.querySelector(`.${popupClass}`);

    if (popup) {
      showPopup(popup);
      toggleScroll();
    }
  });

  body.addEventListener("keydown", (e) => {
    if (e.keyCode !== 27) {
      return;
    }

    let popup = document.querySelector(".popup");

    if (popup) {
      closePopup(popup);
      toggleScroll();
    }
  });

  body.addEventListener("click", (e) => {
    const target = e.target;

    if (
      target.classList.contains("popup-close") ||
      target.classList.contains("popup__inner")
    ) {
      const popup = closestItemByClass(target, "popup");
      closePopup(popup);
      toggleScroll();
    }
  });
})();

//==========link scroll=======================
(function () {
  const body = document.querySelector("body");

  let closestAttr = (item, attr) => {
    let node = item;
    while (node) {
      let attrValue = node.getAttribute(attr);
      if (attrValue) {
        return attrValue;
      }

      node = node.parentElement;
    }
    return null;
  };

  const scroll = (target) => {
    const targetTop = target.getBoundingClientRect().top;
    const scrollTop = window.pageYOffset;
    const targetOffsetTop = targetTop + scrollTop;
    const headerOffset = document.querySelector(".header").clientHeight;

    window.scrollTo(0, targetOffsetTop - headerOffset);
  };

  body.addEventListener("click", (e) => {
    const target = e.target;
    const scrollToItemClass = closestAttr(target, "data-scroll-to");
    if (scrollToItemClass === null) {
      return;
    }
    e.preventDefault();
    const scrollToItem = document.querySelector(`.${scrollToItemClass}`);
    if (scrollToItem) {
      scroll(scrollToItem);
    }
  });
})();

//===========products json parse============

(function () {
  getProducts();
  let productsArray = [];

  const productsContainer = document.querySelector(".products__items");

  async function getProducts() {
    const response = await fetch("./js/products.json");
    productsArray = await response.json();
    renderProducts(productsContainer, productsArray);
  }

  const removeChild = (item) => {
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  };


  //================renderProducts================
  const renderProducts = (container, productsArray) => {
    removeChild(container);
    productsArray.forEach(function (item) {
      const productHTML = `
    <div class="products__item" data-category="${item.data}">
      <div class="products__wrapper card" data-id="${item.id}">
        <img class="product-img" src="img/roll/${item.imgSrc}" alt="">
      <div class="card__body text-center">
        <h4 class="item-title">${item.title}</h4>
        <p><small data-items-in-box class="text-muted">${item.itemsInBox} шт.</small></p>

        <div class="details-wrapper">
          <div class="items counter-wrapper">
            <div class="items__control" data-action="minus">-</div>
            <div class="items__current" data-counter>1</div>
            <div class="items__control" data-action="plus">+</div>
          </div>

          <div class="price">
            <div class="price__weight">${item.weight}г.</div>
            <div class="price__currency">${item.price} ₽</div>
          </div>
        </div>

        <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>

      </div>
    </div>
  </div>
    `;
      container.insertAdjacentHTML("beforeend", productHTML);
    });
  };

  const productsList = document.querySelector(".products__list");


  //=====filterProducts==================
  productsList.addEventListener("click", (e) => {
    const target = e.target;
    const productsItems = JSON.parse(JSON.stringify(productsArray));
    const closestItemByClass = (item, className) => {
      let node = item;
      while (node) {
        if (node.classList.contains(className)) {
          return node;
        }

        node = node.parentElement;
      }
      return null;
    };

    let item = closestItemByClass(target, "products__btn");

    if (item === null || item.classList.contains("is--active")) {
      return;
    }

    e.preventDefault();

    let filterValue = item.getAttribute("data-filter");
    let previousBtnActive = productsList.querySelector(
      ".products__btn.is--active"
    );

    previousBtnActive.classList.remove("is--active");
    item.classList.add("is--active");

    if (filterValue === "all") {
      renderProducts(productsContainer, productsItems);
      return;
    }

    let filterdItems = [];
    for (let i = 0; i < productsItems.length; i++) {
      let currentItem = productsItems[i];
      if (currentItem.data === filterValue) {
        filterdItems.push(currentItem);
      }
    }
    renderProducts(productsContainer, filterdItems);
  });

const order = document.querySelector(".order");
const orderTotal = document.querySelector(".order__total-price");
const cartWrapper = document.querySelector(".cart-wrapper");
const orderWrapper = document.querySelector(".order__list");
  const orderBtn = document.querySelector(".order__btn");
  const menuOrder = document.querySelector(".menu__order");
  const popup = document.querySelector(".popup");

let cart = [];

//=========open cart popup===============
  order.addEventListener("click", () => {
    removeChild(orderWrapper);
  cart.forEach((item) => {
    const cartItemHTML = `
            <div class="cart-item order__item" data-category="${item.data}" data-id="${item.id}">
                    <div class="cart-item__img order__img">
                        <img src="../img/roll/${item.imgSrc}" alt="${item.title}">
                    </div>
                    <div class="cart-item__desc order__descr">
                        <div class="cart-item__title">${item.title}</div>
                        <div class="cart-item__weight">${item.itemsInBox} / ${item.weight}</div>

                        <div class="cart-item__details">
                            <div class="price">
                                <div class="price__currency">${item.price}</div>
                            </div>
                        </div>
                    </div>
                  <div class="order__total"> x ${item.itemsInCart}</div>
            </div>`;
    orderWrapper.insertAdjacentHTML("afterbegin", cartItemHTML);
  });
  });
  
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset(); 
    menuOrder.classList.remove("is--active");
    popup.classList.add("is--active");
    cartWrapper.innerHTML = "";
    cart.length = 0;
    calcCartPrice();
  });


//=============empty cart toggle============
  const toggleCartStatus = () => {
    const cartWrapper = document.querySelector(".products__cart");
    const cartEmptyBadge = document.querySelector("[data-cart-empty]");
    const orderForm = document.querySelector("#order-form");

    if (cartWrapper.children.length > 0) {
      cartEmptyBadge.classList.add("none");
      orderForm.classList.remove("none");
    } else {
      cartEmptyBadge.classList.remove("none");
      orderForm.classList.add("none");
    };
  };

// пересчет общей стоимости товаров в корзине
function calcCartPrice() {
  const totalWrapper = document.querySelector(".total-price");
  const deliveryCost = document.querySelector(".delivery-cost");
  const cartDelivery = document.querySelector("[data-cart-delivery]");

  let totalPrice = 0;

  totalPrice = cart.reduce((sum, item) => sum + (item.price*item.itemsInCart), 0);
 
  // отображаем цену на страницу
  totalWrapper.innerText = totalPrice;
  orderTotal.innerText = `Итого: ${totalPrice} руб.`;

  //скрываем или показываем блок со стоимостью доставки
  if (totalPrice > 0) {
    cartDelivery.classList.remove("none");
  } else {
    cartDelivery.classList.add("none");
  };

  if (totalPrice >= 600) {
    deliveryCost.classList.add("free");
    deliveryCost.innerText = "бесплатно";
  } else {
    deliveryCost.classList.remove("free");
    deliveryCost.innerText = "250 ₽";
  };
};

//добавление или уменьшение количества в корзине
window.addEventListener("click", function (event) {
  let counter;
  let productId;
  if (event.target.closest(".cart-wrapper")) {
    productId = +(event.target.closest(".cart-item").dataset.id);
  }

  if (
    event.target.dataset.action === "plus" ||
    event.target.dataset.action === "minus"
  ) {
    //находим обертку счетчика
    const counterWrapper = event.target.closest(".counter-wrapper");
    counter = counterWrapper.querySelector("[data-counter]");
  }

  if (event.target.dataset.action === "plus") {
    counter.innerText = ++counter.innerText;
    cart.map((item) => {
      if (item.id === productId) {
        item.itemsInCart++;
        calcCartPrice();
      };
    });
  };
  // проверка что клик был совершен по кнопке минус
  if (event.target.dataset.action === "minus") {
    if (parseInt(counter.innerText) > 1) {
      counter.innerText = --counter.innerText;
      cart.map((item) => {
        if (item.id === productId) {
          item.itemsInCart--;
          calcCartPrice();
        };
      });
    } else if (
      event.target.closest(".cart-wrapper") &&
      parseInt(counter.innerText) === 1
    ) {
      event.target.closest(".cart-item").remove();
      cart.map((item, index) => {
        if (item.id === productId) {
          cart.splice(index, 1);
        };
      });

      toggleCartStatus();
      // пересчет общей стоимости товаров в корзине
      calcCartPrice();
    };
  };

  if (
    event.target.hasAttribute("data-action") &&
    event.target.closest(".cart-wrapper")
  ) {
    // пересчет общей стоимости товаров в корзине
    calcCartPrice();
  };
});
  
//============add to cart =============
window.addEventListener("click", function (event) {
  // проверяем что  клик по кнопке добавить в карзину
  if (event.target.hasAttribute("data-cart")) {
    //находим карточку товара по которой был клик
    const card = event.target.closest(".card");  
    const id = +(card.dataset.id);
    const counter = +(card.querySelector("[data-counter]").innerText);
    
    const itemInCart = cartWrapper.querySelector(`[data-id="${id}"]`);
    
    const renderCart = (item) => {
      const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__top">
                    <div class="cart-item__img">
                        <img src="../img/roll/${item.imgSrc}" alt="${item.title}">
                    </div>
                    <div class="cart-item__desc">
                        <div class="cart-item__title">${item.title}</div>
                        <div class="cart-item__weight">${item.itemsInBox} / ${item.weight}</div>

                        <div class="cart-item__details">
                            <div class="items items--small counter-wrapper">
                                <div class="items__control" data-action="minus">-</div>
                                <div class="items__current" data-counter="">${item.itemsInCart}</div>
                                <div class="items__control" data-action="plus">+</div>
                            </div>

                            <div class="price">
                                <div class="price__currency">${item.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    };
    
    // если товар в корзине плюсуем количество
    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerText = parseInt(counterEl.innerText) + parseInt(counter);
      cart.map((item) => {
        if (item.id === id) {
          item.itemsInCart = parseInt(counterEl.innerText); 
          calcCartPrice();
        };
      });
    } else {
      //если товара нет в корзине
      productsArray.map((item) => { 
      if (item.id === id) {      
        item.itemsInCart = +(counter);
        cart.push(item);
        renderCart(item);
        toggleCartStatus();
        calcCartPrice();
      };
    });
    };

    card.querySelector("[data-counter]").innerText = "1";
    toggleCartStatus(); 
    calcCartPrice();
  };
});

})();



//============ yandexMap ==================
(function () {
  if (typeof ymaps === "undefined") {
    return;
  };

  ymaps.ready(init);
  function init() {
    var myMap = new ymaps.Map("map", {
      center: [56.141051, 47.194952],
      zoom: 12,
    });

    var address = document.querySelector("#myadress").innerHTML;

    var geocoder = ymaps.geocode(address);

    geocoder.then(function (res) {
      var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
      myMap.setCenter(coordinates, 16, {
        checkZoomRange: true,
      });
      var placemark = new ymaps.Placemark(
        coordinates,
        {
          hintContent: address,
          balloonContent: "Время работы: Пн-Пт, с 9 до 20",
        },
        {
          iconLayout: "default#image",
          iconImageHref: "../img/icon.svg",
          iconImageSize: [40, 52],
          iconImageOffset: [-5, -38],
        },
        {
          preset: "islands#redDotIcon",
        }
      );

      myMap.geoObjects.add(placemark);
      myMap.behaviors.disable("scrollZoom");
    });
  }
})();

//====================/yandexMaps=======================
