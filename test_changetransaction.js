/*********************************************************************************/
/*
Quick test one transaction - WORKING!
*/
(function(TRANSACTION, MAIN_WALLET_ID, FUTURES_WALLET_ID) {
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

    const fetchPage = async (pageNumber, wallet) => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(),
            redirect: 'follow'
        };
        
        try {
            var postfix = '';
            if (wallet !== undefined)
                postfix = `&q[from_wallet_id_or_to_wallet_id_eq]=${wallet}`;
            const response = await fetch(`https://api.koinly.io/api/transactions?per_page=${PAGE_COUNT}&order=date&page=${pageNumber}` + postfix, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error(`Fetch failed for page=${pageNumber}`)
        }
    }

    const getAllTransactions = async (wallet) => {
        const firstPage = await fetchPage(1, wallet);
        const totalPages = firstPage.meta.page.total_pages;
        const promises = [];
        for (let i=2; i <= totalPages; i++) {
            promises.push(fetchPage(i, wallet));
        }
        const remainingPages = await Promise.all(promises);
        const allPages = [firstPage, ...remainingPages];
        return allPages.flatMap(it => it.transactions);
    }

    const changeTransaction = async (TRANSACTION, DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID) => {
        var obj = {
            transaction: {
                label: null,
                date: DATE,//2021-04-21T14:08:15.000Z
                from_wallet_id: FROM_WALLET_ID,
                from_currency_id: CURRENCY_ID,
                from_amount: AMOUNT,
                type: "transfer",
                to_amount: AMOUNT,
                to_wallet_id: TO_WALLET_ID,
                to_currency_id: CURRENCY_ID
            }
        };
        var header = fetchHeaders();
        header.append('Content-type', 'application/json; charset=UTF-8');
        const requestOptions = {
            method: 'PUT',
            headers: header,
            redirect: 'follow',
            body: JSON.stringify(obj)
        };
        
        try {
            const response = await fetch(`https://api.koinly.io/api/transactions/${TRANSACTION}`, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Change transaction failed')
        }
    }

    const run = async (TRANSACTION, MAIN_WALLET_ID, FUTURES_WALLET_ID) => {
        const session = await fetchSession();
        const transactions = await getAllTransactions(FUTURES_WALLET_ID);
        var DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID;
        for (var i=0; i<transactions.length; i++) {
            var t = transactions[i];
            if (t.id == TRANSACTION) {
                DATE = t.date;
                if (t.type == "crypto_withdrawal" && t.txsrc == "KuCoin Futures Account") {
                    AMOUNT = t.from.amount;
                    CURRENCY_ID = t.from.currency.id;
                    FROM_WALLET_ID = FUTURES_WALLET_ID;
                    TO_WALLET_ID = MAIN_WALLET_ID;
                } else if (t.type == "crypto_deposit" && t.txsrc == "KuCoin Trading Account") {
                    AMOUNT = t.to.amount;
                    CURRENCY_ID = t.to.currency.id;
                    FROM_WALLET_ID = MAIN_WALLET_ID;
                    TO_WALLET_ID = FUTURES_WALLET_ID;
                }
                break;
            }
        }
        console.log(TRANSACTION + ", " + DATE + ", " + FROM_WALLET_ID + ", " + TO_WALLET_ID + ", " + AMOUNT + ", " + CURRENCY_ID)
        await changeTransaction(TRANSACTION, DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID);
    }
    run(TRANSACTION, MAIN_WALLET_ID, FUTURES_WALLET_ID);

})("8868C6237DD05680F92D3C96D4252627", "371BA16D1B860E8C255582ADB8BB7350", "2A3E135325A2060E6615E38127ABD0D4")
