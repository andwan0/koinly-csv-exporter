(function(input) {
    var PAGE_COUNT = 25;

    var getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        const cookieMap = cookies.map(it => it.split('='))
            .reduce((prev, curr) => {
                const [key, value] = curr;
                return {
                    ...prev,
                    [key]: value,
                }
            }, {})
        return cookieMap[name]
    }

    var fetchHeaders = (api_key, portfolio_id, cookie) => {
        const headers = new Headers();
        headers.append('authority', 'api.koinly.io');
        headers.append('accept', 'application/json, text/plain, */*');
        headers.append('accept-language', 'en-GB,en-US;q=0.9,en;q=0.8');
        headers.append('access-control-allow-credentials', 'true');
        headers.append('caches-requests', '1');
        headers.append('cookie', cookie);
        headers.append('origin', 'https://app.koinly.io');
        headers.append('referer', 'https://app.koinly.io/');
        headers.append('sec-fetch-dest', 'empty');
        headers.append('sec-fetch-mode', 'cors');
        headers.append('sec-fetch-site', 'same-site');
        headers.append('sec-gpc', '1');
        headers.append('user-agent', navigator.userAgent);
        headers.append('x-auth-token', api_key);
        headers.append('x-portfolio-token', portfolio_id);
        return headers;
    }

    var fetchSession = async (api_key, portfolio_id, cookie) => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(api_key, portfolio_id, cookie),
            redirect: 'follow'
        };
        
        try {
            const response = await fetch('https://api.koinly.io/api/sessions', requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Fetch session failed')
        }
    }
    var run = async (api_key, portfolio_id, cookie) => {
        console.log(api_key + ' ' + portfolio_id + ' ' + cookie)
        var session = await fetchSession(api_key, portfolio_id, cookie)
        var baseCurrency = session.portfolios[0].base_currency.symbol;
        console.log(session);
    }

    run(input.api_key, input.portfolio_id, input.cookie);

})(obj)