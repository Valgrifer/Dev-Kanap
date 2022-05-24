import { requestApi, getEl } from './common.js';

function getProdTemplate(product)
{
    return `<a href="./product.html?id=${product["_id"]}">
            <article>
              <img src="${product["imageUrl"]}" alt="${product["altTxt"]}">
              <h3 class="productName">${product["name"]}</h3>
              <p class="productDescription">${product["description"]}</p>
            </article>
          </a>`;
}

requestApi()
    .then(products => {
        let content = "";
        for (const product of products)
            content += getProdTemplate(product);

        getEl("section#items").innerHTML = content;
    });