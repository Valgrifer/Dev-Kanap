(() => {
    requestApi(response => {
        let basket = JSON.parse(window.localStorage.getItem("basket") || "[]");

        console.log(basket);

        let content = "";
        for (const article of basket)
            for (const el of response)
                if(article.id === el["_id"])
                    content += `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
                        <div class="cart__item__img">
                          <img src="${el.imageUrl}" alt="${el.altTxt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${el.name}</h2>
                            <p>${article.color}</p>
                            <p>${article.count * el.price} €</p>
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

        getEl("section#cart__items").innerHTML = content;
    });
})()