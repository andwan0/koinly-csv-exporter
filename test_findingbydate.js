/************************************************************************************************************
 * Test on finding a transaction by date & amount
 * 
 */
(function(input) {
    const PAGE_COUNT = 25;

    const getCookie = (name) => {
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

    const fetchHeaders = () => {
        const headers = new Headers();
        headers.append('authority', 'api.koinly.io');
        headers.append('accept', 'application/json, text/plain, */*');
        headers.append('accept-language', 'en-GB,en-US;q=0.9,en;q=0.8');
        headers.append('access-control-allow-credentials', 'true');
        headers.append('caches-requests', '1');
        headers.append('cookie', document.cookie);
        headers.append('origin', 'https://app.koinly.io');
        headers.append('referer', 'https://app.koinly.io/');
        headers.append('sec-fetch-dest', 'empty');
        headers.append('sec-fetch-mode', 'cors');
        headers.append('sec-fetch-site', 'same-site');
        headers.append('sec-gpc', '1');
        headers.append('user-agent', navigator.userAgent);
        headers.append('x-auth-token', getCookie('API_KEY'));
        headers.append('x-portfolio-token', getCookie('PORTFOLIO_ID'));
        return headers;
    }

    const fetchSession = async () => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(),
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

    //2023-05-16T00:00:00.000Z
    //2023-05-16T23:59:59.999Z
    //https://api.koinly.io/api/transactions?order=date_reverse&q[date_gteq]=2023-05-16T00%3A00%3A00.000Z&q[date_lt]=2023-05-16T23%3A59%3A59.999Z&per_page=25
    //https://app.koinly.io/p/transactions?from=2023-05-16T00%3A00%3A00.000Z&order=date_reverse&perPage=25&to=2023-05-16T23%3A59%3A59.999Z
    const fetchPage = async (pageNumber, wallet, fromdate, todate) => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(),
            redirect: 'follow'
        };
        
        try {
            var postfix = '';
            if (wallet !== undefined && wallet)
                postfix+= `&q[from_wallet_id_or_to_wallet_id_eq]=${wallet}`;
            if (fromdate !== undefined && fromdate)
                postfix+= `&q[date_gteq]=${fromdate}`;
            if (todate !== undefined && todate)
                postfix+= `&q[date_lt]=${todate}`;
            const response = await fetch(`https://api.koinly.io/api/transactions?per_page=${PAGE_COUNT}&order=date&page=${pageNumber}` + postfix, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error(`Fetch failed for page=${pageNumber}`)
        }
    }

    const getAllTransactions = async (wallet, fromdate, todate) => {
        const firstPage = await fetchPage(1, wallet, fromdate, todate);
        const totalPages = firstPage.meta.page.total_pages;
        const promises = [];
        for (let i=2; i <= totalPages; i++) {
            promises.push(fetchPage(i, wallet, fromdate, todate));
        }
        const remainingPages = await Promise.all(promises);
        const allPages = [firstPage, ...remainingPages];
        return allPages.flatMap(it => it.transactions);
    }

    const fetchWallets = async (pageNumber) => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(),
            redirect: 'follow'
        };
        
        try {
            const response = await fetch(`https://api.koinly.io/api/wallets?per_page=10&with_ledgers=1&q[sorts]=name asc&q[pool_true]=0&page=${pageNumber}`, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Fetch wallets failed')
        }
    }

    const getAllWallets = async () => {
        const firstPage = await fetchWallets(1);
        const totalPages = firstPage.meta.page.total_pages;
        const promises = [];
        for (let i=2; i <= totalPages; i++) {
            promises.push(fetchWallets(i));
        }
        const remainingPages = await Promise.all(promises);
        const allPages = [firstPage, ...remainingPages];
        return allPages.flatMap(it => it.wallets);
    }

    const run = async (wallet) => {
        const session = await fetchSession();
        const wallets = await getAllWallets();
        var dict = new Object();
        for (var i = 0; i < wallets.length; i++) {
            var id = wallets[i].id;
            var name = wallets[i].name;
            dict[id] = name;
        }
        const baseCurrency = session.portfolios[0].base_currency.symbol;
        var simpledate = '2019-08-26';
        var fromdate = simpledate + 'T00%3A00%3A00.000Z';
        var todate = simpledate + 'T23%3A59%3A59.999Z';
        const transactions = await getAllTransactions(null, fromdate, todate);
        console.log('Your Koinly Transactions\n', transactions);
    }

    if (input !== undefined) {
        if (Array.isArray(input)) {
            for (var i = 0; i < input.length; i++) {
                run(input[i]);
            }
        } else {
            run(input);
        }
    } else {
        run();
    }
})()