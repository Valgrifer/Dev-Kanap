(() => {
    requestApi(response => {
        let content = "";
        for (const el of response)
            content += `<a href="./product.html?id=${el["_id"]}">
            <article>
              <img src="${el["imageUrl"]}" alt="${el["altTxt"]}">
              <h3 class="productName">${el["name"]}</h3>
              <p class="productDescription">${el["description"]}</p>
            </article>
          </a>`;

        document.querySelector("section#items").innerHTML = content;
    });
})()