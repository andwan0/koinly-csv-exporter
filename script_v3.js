var RESET = false;//used by costbasisfix


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const PAGE_COUNT = 25;

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

    var fetchHeaders = () => {
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

    var fetchSession = async () => {
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

    var fetchWallets = async (pageNumber) => {
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

    var getAllWallets = async () => {
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

    //2023-05-16T00:00:00.000Z
    //2023-05-16T23:59:59.999Z
    //https://api.koinly.io/api/transactions?order=date_reverse&q[date_gteq]=2023-05-16T00%3A00%3A00.000Z&q[date_lt]=2023-05-16T23%3A59%3A59.999Z&per_page=25
    //https://app.koinly.io/p/transactions?from=2023-05-16T00%3A00%3A00.000Z&order=date_reverse&perPage=25&to=2023-05-16T23%3A59%3A59.999Z
    //https://api.koinly.io/api/transactions?order=date_reverse&q[from_wallet_id_or_to_wallet_id_eq]=600C0AB3E875A37CF571280650B7CFDE&q[from_currency_id_or_to_currency_id_or_fee_currency_id_eq]=8094&per_page=25
    var fetchPage = async (pageNumber, wallet, fromdate, todate, currency) => {
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
            if (currency !== undefined && currency)
                postfix+= `&q[from_currency_id_or_to_currency_id_or_fee_currency_id_eq]=${currency}`;
            const response = await fetch(`https://api.koinly.io/api/transactions?per_page=${PAGE_COUNT}&order=date&page=${pageNumber}` + postfix, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error(`Fetch failed for page=${pageNumber}`)
        }
    }

    var getAllTransactions = async (wallet, fromdate, todate, currency) => {
        const firstPage = await fetchPage(1, wallet, fromdate, todate, currency);
        const totalPages = firstPage.meta.page.total_pages;
        const promises = [];
        for (let i=2; i <= totalPages; i++) {
            promises.push(fetchPage(i, wallet, fromdate, todate, currency));
        }
        const remainingPages = await Promise.all(promises);
        const allPages = [firstPage, ...remainingPages];
        return allPages.flatMap(it => it.transactions);
    }

    var toCSVFile = (baseCurrency, transactions, id, name) => {  
   
        // Headings
        // Representing Koinly Spreadsheet (https://docs.google.com/spreadsheets/d/1dESkilY70aLlo18P3wqXR_PX1svNyAbkYiAk2tBPJng/edit#gid=0)
        const headings = [
           'Date',
           'Sent Amount',
           'Sent Currency',
           'Received Amount',
           'Received Currency',
           'Fee Amount',
           'Fee Currency',
           'Net Worth Amount',
           'Net Worth Currency',
           'Label',
           'Description',
           'TxHash',
           'TxSrc',
           'TxDest',
           'Type'
           // EXTRA_HEADERS: Add extra headers as necessary (ensure you also update "row" below)
        ]
        
        transactionRows = transactions.map((t) => { 
           const row = [
               t.date,
               t.from ? t.from.amount : '',
               t.from ? t.from.currency.symbol : '',
               t.to ? t.to.amount : '',
               t.to ? t.to.currency.symbol : '',
               t.fee ? t.fee.amount : '',
               t.fee ? t.fee.currency.symbol : '',
               t.net_value,
               baseCurrency,
               t.type,
               t.description,
               t.txhash,
               t.txsrc,
               t.txdest,
               t.label
               // EXTRA_FIELDS: Add extra fields as necessary (ensure you also update "headings" above)
           ];
           if (t.type == 'transfer') {
                if (t.from.wallet.id == id) {//delete the other side
                    row[3] = '';
                    row[4] = '';
                } else if (t.to.wallet.id == id) {
                    row[1] = '';
                    row[2] = '';
                }
            }
            if (t.txhash) {
                if (t.txhash.includes('submember_transfer'))
                    return '';
            }
           return row.join(',');  
        });
   
        const csv = [
            headings.join(','), 
            ...transactionRows
        ].join('\n');
         
        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        if (name !== undefined)
            hiddenElement.download = name + '.csv';
        else
            hiddenElement.download = 'Koinly Transactions.csv';
        hiddenElement.click();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    //used in bybitfix
    var ignoreTransaction = async (TRANSACTION) => {
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
    
    var changeTransaction_costbasis = async (TYPE, TRANSACTION, DATE, AMOUNT, CURRENCY_ID, COST_BASIS, OLD_COST_BASIS) => {
        var obj = {
            transaction: {
                label: TYPE,
                //date: DATE,//2021-04-21T14:08:15.000Z
                //from_wallet_id: FROM_WALLET_ID,
                //from_currency_id: CURRENCY_ID,
                //from_amount: AMOUNT,
                //type: "transfer",
                //to_amount: AMOUNT,
                //to_wallet_id: TO_WALLET_ID,
                //to_currency_id: CURRENCY_ID
                description: 'cost basis ' + COST_BASIS + ', old cost basis ' + OLD_COST_BASIS,
            }
        };
        if (TYPE == 'fork') {
            obj.transaction.net_worth_amount = COST_BASIS;
            obj.transaction.net_worth_currency_id = 10;
        }

        if (RESET) {
            obj.transaction.label = null;
            obj.transaction.net_worth_amount = "";
        }

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
            console.log('CHANGED ' + TYPE + ' ' + DATE + ' ' + AMOUNT + ' ' + COST_BASIS)
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Change transaction failed')
        }
    }
    
    var changeTransaction_kucoinfuturesfix = async (TRANSACTION, DATE, FROM_WALLET_ID, TO_WALLET_ID, AMOUNT, CURRENCY_ID) => {
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

    var fetchCurrency = async (symbol) => {
        const requestOptions = {
            method: 'GET',
            headers: fetchHeaders(),
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://api.koinly.io/api/currencies?portfolio_only=1&search=${symbol}`, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error(`Fetch currency failed for ${symbol}`)
        }
    }

    var changeTransaction_stakingfix = async (TYPE, TRANSACTION) => {
        var obj = {
            transaction: {
                label: null,
                type: TYPE,
                id: TRANSACTION
            }
        };
        var POOL = '';
        if (TYPE == "crypto_withdrawal" && !RESET) {
            obj.transaction.label = 'to_pool';
            obj.transaction.type = 'transfer';
            POOL = 'pooled';
        } else {
            obj.transaction.label = null;
            obj.transaction.type = 'crypto_withdrawal';
            POOL = 'unpool';
        }
        if (TYPE == "crypto_deposit" && !RESET) {
            obj.transaction.label = 'from_pool';
            obj.transaction.type = 'transfer';
            POOL = 'pooled';
        } else {
            obj.transaction.label = null;
            obj.transaction.type = 'crypto_deposit';
            POOL = 'unpool';
        }

        var header = fetchHeaders();
        header.append('Content-type', 'application/json; charset=UTF-8');
        const requestOptions = {
            method: 'POST',
            headers: header,
            redirect: 'follow',
            body: JSON.stringify(obj)
        };
        
        try {
            const response = await fetch(`https://api.koinly.io/api/transactions/${TRANSACTION}/${POOL}`, requestOptions);
            console.log(POOL + ' ' + TYPE + ' ' + TRANSACTION);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Staking transaction failed')
        }
    }

    var deleteTransaction = async (TRANSACTION) => {
        var header = fetchHeaders();
        header.append('Content-type', 'application/json; charset=UTF-8');
        const requestOptions = {
            method: 'DELETE',
            headers: header,
            redirect: 'follow'
        };
        
        try {
            const response = await fetch(`https://api.koinly.io/api/transactions/${TRANSACTION}`, requestOptions);
            return response.json();
        } catch(err) {
            console.error(err)
            throw new Error('Delete transaction failed')
        }
    }

    //experimental forcing a tran to API
    //890858B7BA4E6882F6F0738E3E75E1C8
    //accidental deleted a staking
    var replaceTransaction = async (TRANSACTION) => {
        var obj = {
            transaction: {
                "id": TRANSACTION,
                "type": "deposit",
                "to": {
                    "source": "api"
                },
                "date": "2023-02-27T01:35:53.000Z",
                "label": "staking",
                "description": null,
                "synced": true,
                "manual": false,
            },
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
            throw new Error('Replace transaction failed')
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const timer = ms => new Promise(res => setTimeout(res, ms))

    //Original download CSV v2
    var run_downloadcsv = async (wallet) => {
        const session = await fetchSession();
        const wallets = await getAllWallets();
        var dict = new Object();
        for (var i = 0; i < wallets.length; i++) {
            var id = wallets[i].id;
            var name = wallets[i].name;
            dict[id] = name;
        }
        const baseCurrency = session.portfolios[0].base_currency.symbol;
        const transactions = await getAllTransactions(wallet);
        console.log('Your Koinly Transactions\n', transactions);
        toCSVFile(baseCurrency, transactions, wallet, dict[wallet]);
    }

    //Remove submember_transfer_* (TxHash)
    //use for loop on array of wallets
    var run_bybitfix = async (wallet) => {
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

    //Cost Basis Fix
    var run_costbasisfix = async (json) => {
        const session = await fetchSession();
        const wallets = await getAllWallets();
        var dict = new Object();
        for (var i = 0; i < wallets.length; i++) {
            var id = wallets[i].id;
            var name = wallets[i].name;
            dict[id] = name;
        }
        const baseCurrency = session.portfolios[0].base_currency.symbol;

        var counter = 0;
        const obj = JSON.parse(json);
        for (let k in obj) {
            //console.log('loop ' + k);
            let part = obj[k];
            var fromdate = k + 'T00%3A00%3A00.000Z';
            var todate = k + 'T23%3A59%3A59.999Z';
            const transactions = await getAllTransactions(null, fromdate, todate);
            //console.log('Koinly Transactions for ' + k + '\n', transactions);
            for (var i = 0; i < part.length; i++) {
                //console.log('loop ' + i);
                let tran = part[i];
                //find the transactionid
                var FOUNDIT = false;
                for (var j = 0; j < transactions.length; j++) {
                    //console.log('loop ' + j);
                    var t = transactions[j];
                    var DATE = "", AMOUNT = "", CURRENCY = "", CURRENCY_ID = "", TRANSACTION = "";
                    TRANSACTION = t.id;
                    DATE = t.date;
                    if (t.type == "crypto_withdrawal") {//gift
                        AMOUNT = t.from.amount;
                        CURRENCY = t.from.currency.symbol;
                        CURRENCY_ID = t.from.currency.id;
                    } else if (t.type == "crypto_deposit") {//fork - need cost basis
                        AMOUNT = t.to.amount;
                        CURRENCY = t.to.currency.symbol;
                        CURRENCY_ID = t.to.currency.id;
                    }
                    if (AMOUNT == tran.value1 || AMOUNT == tran.value2
                        && CURRENCY == tran.currency) {//found match!!!
                            console.log('FOUND MATCH ' + AMOUNT + ' ' + CURRENCY);
                            if (t.type == "crypto_withdrawal") {//gift  && t.label == null
                                await changeTransaction_costbasis("gift", TRANSACTION, DATE, AMOUNT, CURRENCY_ID, t.net_value, t.from.cost_basis);//from cost_basis = original cost_basis before Koinly blanks it
                            } else if (t.type == "crypto_deposit") {//fork - need cost basis
                                await changeTransaction_costbasis("fork", TRANSACTION, DATE, AMOUNT, CURRENCY_ID, tran.worth, t.to.cost_basis);
                            }
                            counter++;
                            await timer(500); // then the created Promise can be awaited
                            FOUNDIT = true;
                            break;
                    }
                }
                if (FOUNDIT == false) {
                    console.log('------> COULD NOT FIND ' + k + ' ' + tran.value1 + ' ' + tran.currency + ' ' + tran.from + ' ' + tran.to);
                }
                //if (counter == 1)//test a small amount
                //    break;
            }
            //if (counter == 1)//test a small amount
            //    break;
        }
        console.log("COMPLETE!!!!");

    }
    
    var run_kucoinfuturesfix = async (MAIN_WALLET_ID, FUTURES_WALLET_ID) => {
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

    //OKx staking fix
    var run_okxstakingfix = async (WALLETID, json) => {
        const session = await fetchSession();
        var transactions = await getAllTransactions(WALLETID);

        var counter = 0;
        //Part 1 is just mainly if this is API version which has the pooled/unpool trans
        for (var i = 0; i < transactions.length; i++) {
            var tran = transactions[i];
            //NORMAL CONVERSION
            if (tran.description == 'Sent to staking'
                && tran.type == 'crypto_withdrawal'
                && tran.to == null
                && tran.label == null) {
                //change to sent to pool
                await changeTransaction_stakingfix('crypto_withdrawal', tran.id)
            }
            if (tran.description == 'Received from staking'
                && tran.type == 'crypto_deposit'
                && tran.from == null
                && tran.label == null) {
                //change to received from pool
                await changeTransaction_stakingfix('crypto_deposit', tran.id)
            }
            //REVERSAL
            if (tran.description == 'Sent to staking'
                && tran.type == 'transfer'
                && tran.to.wallet.pool == true
                && tran.label == 'to_pool') {
                //unpool it
                await changeTransaction_stakingfix('crypto_withdrawal', tran.id)
            }
            if (tran.description == 'Received from staking'
                && tran.type == 'transfer'
                && tran.from.wallet.pool == true
                && tran.label == 'from_pool') {
                //unpool it
                await changeTransaction_stakingfix('crypto_deposit', tran.id)
            }

            counter++;
            await timer(500); // then the created Promise can be awaited
            if (counter == 1)
                break;
        }

        //Part 2 is doing the rewards
        counter = 0;
        const obj = JSON.parse(json);
        for (var h = 0; h < obj.length; h++) {
            var currencyobj = await fetchCurrency(obj[h].symbol);
            if (currencyobj.currencies.length > 1)
                console.log('WARNING: FOUND MORE THAN 1 FOR SYMBOL ' + obj[h].symbol);
            var currencyid = currencyobj.currencies[0].id;
            //we are looking for daily reward of X amount
            var DAILYREWARD = obj[h].daily_reward;
            //double check this is an early termination stake
            if (obj[h].subtraction == 0) {
                console.log('SKIP ' + obj[h].symbol + ' ' + obj[h].fixed_term);
                continue;
            }

            const transactions = await getAllTransactions(WALLETID, null, null, currencyid);
            for (var i = 0; i < transactions.length; i++) {
                
                

                var tran = transactions[i];
                //NORMAL CONVERSION
                if (tran.description == null
                    && tran.type == 'crypto_deposit'
                    && tran.to.amount == DAILYREWARD
                    && tran.label == 'staking') {
                    await changeTransaction_stakingfix('crypto_withdrawal', tran.id)
                }

    
                counter++;
                await timer(500); // then the created Promise can be awaited
                if (counter == 1)
                    break;
            }

            counter++;
            await timer(500); // then the created Promise can be awaited
            if (counter == 1)
                break;
        }

        console.log("COMPLETE!!!!");
    }

    run_okxstakingfix('2253116EF2E4D161E10DD6E659946FFF', _data);//kgpo api
    //run_okxstakingfix('600C0AB3E875A37CF571280650B7CFDE', _data);//gak2 csv only