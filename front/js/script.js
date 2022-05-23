(() => {
    const ORIGIN = "http://valgrifer.fr:3000";
    const URL = ORIGIN + "/api/products";

    function requestApi(callback, path = "/", method = 'GET')
    {
        let params = {
            method: method,
            headers: {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*",
            },
            mode: 'no-cors'
        };

        const request = new Request(URL + path, params);

        fetch(request, params)
            .then(response => {
                console.log(response);
            })
            // .then(response => {
            //     if (response.status === 200) {
            //         return response.json();
            //     } else {
            //         throw new Error('Something went wrong on api server!');
            //     }
            // })
            // .then(response => {
            //     console.debug(response);
            //     if(callback)
            //         callback(response);
            // })
            .catch(error => {
                console.error(error);
            });
    }

    requestApi(response => {
        console.log(response.length);
    });
})()