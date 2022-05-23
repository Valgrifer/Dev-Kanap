(() => {
    let id = getParams("id");
    let data = undefined;

    function dataToArticle()
    {
        return {
            id: data["_id"],
            count: 0,
            color: null,
        };
    }

    requestApi(response => {
        data = response;

        getEl("title").innerHTML = response["name"];
        getEl("article div.item__img").innerHTML = `<img src="${response["imageUrl"]}" alt="${response["altTxt"]}">`;
        getEl("h1#title").innerHTML = response["name"];
        getEl("span#price").innerHTML = response["price"];
        getEl("p#description").innerHTML = response["description"];

        let options = "";
        for (const color of response["colors"])
            options += `<option value="${color}">${color}</option>`;
        getEl("select#color-select").innerHTML = options;
    }, `/${id}/`);

    getEl("button#addToCart").onclick = event => {
        if(data === undefined)
            return;

        let basket = getBasket();

        let thisArticle = dataToArticle();
        thisArticle.color = getEl("select#color-select").value;
        thisArticle.count = parseInt(getEl("input#itemQuantity").value);

        if(thisArticle.count < 1)
            return;

        let added = false;

        for (const x in basket)
            if(basket[x].id === thisArticle.id && basket[x].color === thisArticle.color)
            {
                basket[x].count += thisArticle.count;
                added = true;
                break;
            }

        if(!added)
            basket.push(thisArticle);

        window.localStorage.setItem("basket", JSON.stringify(basket));

        document.location = "./cart.html";
    };
})()