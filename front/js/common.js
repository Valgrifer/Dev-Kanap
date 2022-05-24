const REQUEST_URL = "http://valgrifer.fr:3000/api/products";

function requestApi(path = "/", method = 'GET', body, headers)
{
    let params = {
        method: method,
    };

    if(body !== undefined)
        params.body = body;

    if(headers !== undefined)
        params.headers = headers;

    return fetch(REQUEST_URL + path, params)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        })
}

function getParams(key)
{
    let str = document.location.href;
    let url = new URL(str);
    return url.searchParams.get(key);
}

function getEl(query)
{ return document.querySelector(query); }

function getBasket()
{
    return JSON.parse(window.localStorage.getItem("basket")) ?? [];
}
export { REQUEST_URL, requestApi, getParams, getEl, getBasket }