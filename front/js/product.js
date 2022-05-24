import {getBasket, getEl, getParams, requestApi} from "./common.js";

let id = getParams("id");

function dataToArticle(product)
{
    return {
        id: product["_id"],
        count: 0,
        color: null,
    };
}

function displayData(product)
{
    getEl("title").textContent = product.name;
    getEl("article div.item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    getEl("h1#title").textContent = product.name;
    getEl("span#price").textContent = product.price;
    getEl("p#description").textContent = product.description;

    let select = getEl("select#color-select");
    for (const color of product.colors)
    {
        let option = document.createElement("option");
        option.text = color;
        select.add(option);
    }
}

function addArticle(article)
{
    return () => {
        let basket = getBasket();

        article.color = getEl("select#color-select").value;
        article.count = parseInt(getEl("input#itemQuantity").value);

        if(article.count < 1)
            return;

        let added = false;

        for (const x in basket)
            if(basket[x].id === article.id && basket[x].color === article.color)
            {
                basket[x].count += article.count;
                added = true;
                break;
            }

        if(!added)
            basket.push(article);

        window.localStorage.setItem("basket", JSON.stringify(basket));

        document.location = "./cart.html";
    }
}

requestApi(`/${id}/`)
    .then(product => {
        displayData(product);

        let article = dataToArticle(product);

        getEl("button#addToCart").onclick = addArticle(article);
    });
