(() => {
    let totalQuantity = getEl("span#totalQuantity");
    let totalPrice = getEl("span#totalPrice");

    function getArticle(el)
    {
        return el.closest("article");
    }

    let onchange = event => {
        let article = getArticle(event.target);
        let id = article.dataset.id;
        let color = article.dataset.color;
        let price = parseInt(article.querySelector("span.price").innerHTML);

        let newvalue = parseInt(event.target.value);

        let basket = getBasket();

        for (const x in basket)
            if(basket[x].id === id && basket[x].color === color)
            {
                basket[x].count = newvalue;
                break;
            }

        window.localStorage.setItem("basket", JSON.stringify(basket));

        let totalCount = 0;
        let totalPrice2 = 0;
        for (const art of basket)
        {
            totalCount += art.count;
            totalPrice2 += art.count * parseInt(getEl(`article[data-id="${art.id}"] span.price`).innerHTML);
        }

        totalQuantity.innerHTML = totalCount;
        totalPrice.innerHTML = totalPrice2;
    };
    let ondelete = event => {
        let article = getArticle(event.target);
        let id = article.dataset.id;
        let color = article.dataset.color;

        article.remove();

        let basket = getBasket();

        for (const x in basket)
            if(basket[x].id === id && basket[x].color === color)
            {
                basket.splice(x, 1);
                break;
            }

        window.localStorage.setItem("basket", JSON.stringify(basket));
    };


    requestApi(response => {
        let basket = getBasket();

        console.log(basket);

        let totalCount = 0;
        let totalPrice2 = 0;
        let content = "";
        for (const article of basket)
            for (const el of response)
                if (article.id === el["_id"])
                {
                    content += `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
                        <div class="cart__item__img">
                          <img src="${el.imageUrl}" alt="${el.altTxt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${el.name}</h2>
                            <p>${article.color}</p>
                            <p><span class="price">${el.price}</span> €</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : </p>
                              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.count}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                              <p class="deleteItem">Supprimer</p>
                            </div>
                          </div>
                        </div>
                      </article>`;
                    totalCount += article.count;
                    totalPrice2 += article.count * el.price;
                }

        totalQuantity.innerHTML = totalCount;
        totalPrice.innerHTML = totalPrice2;
        getEl("section#cart__items").innerHTML = content;


        document.querySelectorAll("input.itemQuantity").forEach(el => el.onchange = onchange);
        document.querySelectorAll("p.deleteItem").forEach(el => el.onclick = ondelete);
    });
})()