/*
Link KuCoin Futures to KuCoin
*/
(function(MAIN_WALLET_ID, FUTURES_WALLET_ID) {

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

    const changeTransaction_kucoinfuturesfix = async (TRANSACTION, DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID) => {
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

    const timer = ms => new Promise(res => setTimeout(res, ms))

    const run_kucoinfuturesfix = async (MAIN_WALLET_ID, FUTURES_WALLET_ID) => {
        const session = await fetchSession();
        const transactions = await getAllTransactions(FUTURES_WALLET_ID);
        
        var counter = 0;
        for (var i=0; i<transactions.length; i++) {
            var t = transactions[i];
            var DATE = "", FROM_WALLET_ID = "", TO_WALLET_ID = "", AMOUNT = "", CURRENCY_ID = "", TRANSACTION = "";
            TRANSACTION = t.id;
            DATE = t.date;
            var DOIT = false;
            if (t.type == "crypto_withdrawal" && t.txsrc == "KuCoin Futures Account") {
                AMOUNT = t.from.amount;
                CURRENCY_ID = t.from.currency.id;
                FROM_WALLET_ID = FUTURES_WALLET_ID;
                TO_WALLET_ID = MAIN_WALLET_ID;
                DOIT = true;
            } else if (t.type == "crypto_deposit" && (t.txsrc == "KuCoin Main Account" || t.txsrc == "KuCoin Trading Account")) {
                AMOUNT = t.to.amount;
                CURRENCY_ID = t.to.currency.id;
                FROM_WALLET_ID = MAIN_WALLET_ID;
                TO_WALLET_ID = FUTURES_WALLET_ID;
                DOIT = true;
            }
            if (DOIT) {
                console.log(TRANSACTION + ", " + DATE + ", " + FROM_WALLET_ID + ", " + TO_WALLET_ID + ", " + AMOUNT + ", " + CURRENCY_ID)
                await changeTransaction_kucoinfuturesfix(TRANSACTION, DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID);
                counter++;
                await timer(500); // then the created Promise can be awaited
            }
            //if (counter == 3)//test a small amount
            //    break;
        }
        console.log("COMPLETE!!!!");
    }
    run_kucoinfuturesfix(MAIN_WALLET_ID, FUTURES_WALLET_ID);
})("60EA22447E5E976E8EF187A6CA48E8B0", "8C1F09D8ED5CF12F32BCAC2DC1143B26");