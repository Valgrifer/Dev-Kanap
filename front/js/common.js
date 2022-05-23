const URL = "http://localhost:3000/api/products";

function requestApi(callback, path = "/", method = 'GET')
{
    let params = {
        method: method,
    };

    const request = new Request(URL + path, params);

    fetch(request, params)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(response => {
            console.log(response);
            if(callback)
                callback(response);
        })
        .catch(error => {
            console.error(error);
        });
}