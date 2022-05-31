import {getBasket, getEl, requestApi} from "./common.js";

let totalQuantity = getEl("span#totalQuantity");
let totalPrice = getEl("span#totalPrice");

function articleTemplate(article, product)
{
    return `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${article.color}</p>
            <p><span class="price">${product.price}</span> €</p>
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
}

requestApi().then(products => {
    let basket = getBasket();

    let totalCount = 0;
    let totalPrice2 = 0;
    let content = "";
    for (const article of basket)
        for (const product of products)
            if (article.id === product["_id"])
            {
                content += articleTemplate(article, product);
                totalCount += article.count;
                totalPrice2 += article.count * product.price;
            }

    totalQuantity.innerText = totalCount;
    totalPrice.innerText = totalPrice2;
    getEl("section#cart__items").innerHTML = content;


    getEl("section#cart__items").onchange = quantityChangeEvent;
    document.querySelectorAll("p.deleteItem").forEach(el => el.onclick = productDeleteEvent);
});

const productDeleteEvent = event => {
    let article = event.target.closest("article");
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

const quantityChangeEvent = event => {
    let article = event.target.closest("article");
    let id = article.dataset.id;
    let color = article.dataset.color;

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
        totalPrice2 += art.count * parseInt(getEl(`article[data-id="${art.id}"] span.price`).innerText);
    }

    totalQuantity.innerText = totalCount;
    totalPrice.innerText = totalPrice2;
}

const regextable = {
    firstName: {
        regex: /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/,
        message: "Ceci n'est pas un prénom valide"
    },
    lastName: {
        regex: /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/,
        message: "Ceci n'est pas un nom valide"
    },
    address: {
        regex: /^[0-9]{1,3}(?:(:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/,
        message: "Ceci n'est pas une adresse valide"
    },
    city: {
        regex: /^[a-zA-Zéèêëàâäîïôöûüùç\- ]{2,}$/,
        message: "Ceci n'est pas une ville valide"
    },
    email: {
        regex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        message: "Ceci n'est pas un email valide"
    },
};
getEl("form.cart__order__form").onsubmit = event => {
    event.preventDefault();

    let basket = getBasket();
    let error = false;

    if(basket.length < 1)
    {
        alert("Panier vide");
        return;
    }

    let data = {
        contact: {},
        products: []
    }

    for (const x in regextable) {
        let input = event.target.elements[x];
        let table = regextable[x];
        if(!input.name)
            return;

        let errorEl = event.target.querySelector("p#" + x + "ErrorMsg")

        if(table.regex.test(input.value))
        {
            data.contact[input.name] = input.value;

            if(errorEl.innerText !== "")
                errorEl.innerText = "";
        }
        else
        {
            error = true;

            if (errorEl.innerText !== table.message)
                errorEl.innerText = table.message;
        }
    }

    if(error)
        return;

    for (const article of basket)
        data.products.push(article.id);

    requestApi("/order/", "POST", JSON.stringify(data), {
            'Content-Type': 'application/json'
        })
        .then(response => {
            if(!response.orderId)
                return;

            window.localStorage.setItem("basket", "[]");
            document.location = "./confirmation.html?orderId=" + response.orderId;
        })
        .catch(() => {
            alert("Erreur dans la commande, formulaire incomplet?");
        });
};