/*
Remove submember_transfer_* (TxHash)
*/
//and koinly
var aWallets = [
    'F306B7FD434358A5BB6019D2EBD7322B',//H1 Bybit2
    '8A6E76815B5B35AF9638D1BD5CC591DD',//H1 Bybit3
];

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    //used in bybitfix
    const ignoreTransaction = async (TRANSACTION) => {
        var header = fetchHeaders();
        header.append('Content-type', 'application/json; charset=UTF-8');
        const requestOptions = {
            method: 'POST',
            headers: header,
            redirect: 'follow'
        };
        
        try {
            const response = await fetch(`https://api.koinly.io/api/transactions/${TRANSACTION}/ignore`, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Ignore transaction failed')
        }
    }

    const timer = ms => new Promise(res => setTimeout(res, ms))

    const run_bybitfix = async (wallet) => {
        const session = await fetchSession();
        const transactions = await getAllTransactions(wallet);
        
        var counter = 0;
        for (var i=0; i<transactions.length; i++) {
            var t = transactions[i];
            var TRANSACTION = "";
            var DOIT = false;
            if (t.type == "crypto_deposit" && (t.txhash && t.txhash.startsWith("submember_transfer_"))) {
                TRANSACTION = t.id;
                DOIT = true;
            }
            if (DOIT) {
                console.log(TRANSACTION);
                await ignoreTransaction(TRANSACTION);
                counter++;
                await timer(1000); // then the created Promise can be awaited
            }
            //if (counter == 2)//test a small amount
            //    break;
        }
        console.log(wallet + " wallet COMPLETE!!!!");
    }

    if (input !== undefined) {
        if (Array.isArray(input)) {
            for (var i = 0; i < input.length; i++) {
                run_bybitfix(input[i]);
            }
        } else {
            run_bybitfix(input);
        }
    } else {
        run_bybitfix();
    }
})(aWallets);