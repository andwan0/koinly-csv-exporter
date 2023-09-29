var RESET = false;
//Treat forks as income
var _data = `{
   "2019-07-04": [
      {
         "diff": 0.00002,
         "value1": 25,
         "value2": 24.99998,
         "currency": "XLM",
         "from": "From UKKrakKC",
         "to": "To Legohead",
         "worth": 2.58,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-07-17": [
      {
         "diff": 0.3,
         "value1": 25,
         "value2": 24.7,
         "currency": "ADA",
         "from": "From UKKrakKC",
         "to": "To Legohead",
         "worth": 1.42,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 0.00118953,
         "value2": 0.00118953,
         "currency": "BTC",
         "from": "From UKCoinbaseKC",
         "to": "To UKBinJean",
         "worth": 12.57,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-08-07": [
      {
         "diff": 0,
         "value1": 18,
         "value2": 18,
         "currency": "NEO",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 307.08,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 661.431,
         "value2": 661.431,
         "currency": "ZRX",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 192.0134193,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-08-08": [
      {
         "diff": 0,
         "value1": 4549.445,
         "value2": 4549.445,
         "currency": "SYS",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 195.3986628,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 4379.615,
         "value2": 4379.615,
         "currency": "TRX",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 139.9724954,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 444.78457,
         "value2": 444.78457,
         "currency": "ARK",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 191.5687143,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-08-17": [
      {
         "diff": 0,
         "value1": 3616.162135,
         "value2": 3616.162135,
         "currency": "ADA",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 276.6364033,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 1823.91885,
         "value2": 1823.91885,
         "currency": "XLM",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 182.391885,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 52.594446,
         "value2": 52.594446,
         "currency": "QTUM",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 247.877624,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 1.93797,
         "value2": 1.93797,
         "currency": "LTC",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 229.8820014,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 2.68693,
         "value2": 2.68693,
         "currency": "DASH",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 414.7276455,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-08-26": [
      {
         "diff": 0,
         "value1": 25,
         "value2": 25,
         "currency": "XLM",
         "from": "From Legohead",
         "to": "To Trezor",
         "worth": 2.58,
         "wcurr": "USD",
         "type": "GIFT"
      },
      {
         "diff": 0,
         "value1": 25,
         "value2": 25,
         "currency": "ADA",
         "from": "From Legohead",
         "to": "To Trezor",
         "worth": 1.44,
         "wcurr": "USD",
         "type": "GIFT"
      },
      {
         "diff": 0,
         "value1": 25,
         "value2": 25,
         "currency": "XRP",
         "from": "From UKCoinbaseKC",
         "to": "To Legohead",
         "worth": 8.03,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-10-14": [
      {
         "diff": 0,
         "value1": 3718.55808,
         "value2": 3718.55808,
         "currency": "XRP",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 1411.200351,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2019-10-22": [
      {
         "diff": 0,
         "value1": 284.3651,
         "value2": 284.3651,
         "currency": "XRP",
         "from": "From Ally",
         "to": "To Legohead",
         "worth": 863.250798,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2021-02-11": [
      {
         "diff": 0.00015,
         "value1": 1.51121,
         "value2": 1.51106,
         "currency": "BTC",
         "from": "From HKKrakKC",
         "to": "To HKPhemBless",
         "worth": 74097.17,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": -0.6,
         "value1": 2942.052779,
         "value2": 2942.652779,
         "currency": "ADA",
         "from": "From HKKrakKC",
         "to": "To UKBinJean",
         "worth": 2747.76,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 6.199,
         "value2": 6.199,
         "currency": "BNB",
         "from": "From UKBinKC",
         "to": "To UKBinJean",
         "worth": 793.79,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 5.999,
         "value2": 5.999,
         "currency": "BNB",
         "from": "From UKBinKC",
         "to": "To UKBinJean",
         "worth": 768.18,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2021-02-20": [
      {
         "diff": 0,
         "value1": 16.8297036,
         "value2": 16.8297036,
         "currency": "BNB",
         "from": "From UKBinKC",
         "to": "To UKBinJean",
         "worth": 4730.3,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 54.79245167,
         "value2": 54.79245167,
         "currency": "BNB",
         "from": "From UKBinKC",
         "to": "To UKBinJean",
         "worth": 11818.26,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2021-02-21": [
      {
         "diff": -0.0008,
         "value1": 0.0092,
         "value2": 0.01,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKGoldenEggKC",
         "worth": 1.28,
         "wcurr": "USD",
         "type": "GIFT"
      },
      {
         "diff": -0.0008,
         "value1": 15.46370438,
         "value2": 15.46450438,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKGoldenEggKC",
         "worth": 1983.63,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-02-23": [
      {
         "diff": 0,
         "value1": 15.41284072,
         "value2": 15.41284072,
         "currency": "BNB",
         "from": "From UKBinKC",
         "to": "To UKBinJean",
         "worth": 3283.09,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 12,
         "value1": 7016.5,
         "value2": 7004.5,
         "currency": "USDT",
         "from": "From UKBinKC",
         "to": "To HKBybitBless",
         "worth": 7016.5,
         "wcurr": "USDT",
         "type": "FORK"
      },
      {
         "diff": -0.0005,
         "value1": 1.57368931,
         "value2": 1.57418931,
         "currency": "BTC",
         "from": "From HKPhemBless",
         "to": "To HKPhemKC (DUPLICATE)",
         "worth": 76493.1,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-02-24": [
      {
         "diff": -0.0005,
         "value1": 1.57368931,
         "value2": 1.57418931,
         "currency": "BTC",
         "from": "From HKPhemBless",
         "to": "To HKPhemKC (DUPLICATE)",
         "worth": 76493.1,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-03-01": [
      {
         "diff": -0.0008,
         "value1": 2.9992,
         "value2": 3,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKGoldenEggKC",
         "worth": 384.81,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-03-02": [
      {
         "diff": 0.0005,
         "value1": 0.2005,
         "value2": 0.2,
         "currency": "BTC",
         "from": "From HKPhemKC",
         "to": "To HKPhemBless",
         "worth": 10747.56,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 25.01427629,
         "value2": 25.01427629,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKBinKC",
         "worth": 4740.52,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-03-04": [
      {
         "diff": 0.0005,
         "value1": 0.2,
         "value2": 0.1995,
         "currency": "BTC",
         "from": "From HKPhemKC",
         "to": "To HKPhemBless (DUPLICATE)",
         "worth": 11359.52,
         "wcurr": "USD",
         "type": "FORK"
      }
   ],
   "2021-03-05": [
      {
         "diff": 0.0005,
         "value1": 0.2,
         "value2": 0.1995,
         "currency": "BTC",
         "from": "From HKPhemKC",
         "to": "To HKPhemBless (DUPLICATE)",
         "worth": 11359.52,
         "wcurr": "USD",
         "type": "FORK"
      },
      {
         "diff": 0,
         "value1": 15.0012345,
         "value2": 15.0012345,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKBinKC",
         "worth": 4216.37,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-03-15": [
      {
         "diff": -0.0005,
         "value1": 0.12548343,
         "value2": 0.12598343,
         "currency": "BTC",
         "from": "From HKBybitBless",
         "to": "To UKBinKC",
         "worth": 6641.49,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-04-12": [
      {
         "diff": -1,
         "value1": 6019.1738,
         "value2": 6020.1738,
         "currency": "ADA",
         "from": "From HKPhemBless",
         "to": "To HKKrakKC",
         "worth": 7002.44,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-05-17": [
      {
         "diff": 0,
         "value1": 62.9995,
         "value2": 62.9995,
         "currency": "BNB",
         "from": "From UKBinJean",
         "to": "To UKBinKC",
         "worth": 40372.22,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-06-06": [
      {
         "diff": 0,
         "value1": 38334508.88,
         "value2": 38334508.88,
         "currency": "SHIB",
         "from": "From UKBinJean",
         "to": "To UKBinKC",
         "worth": 547.91,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-06-14": [
      {
         "diff": -0.2,
         "value1": 26.74153811,
         "value2": 26.94153811,
         "currency": "ATA",
         "from": "From UKBinJean",
         "to": "To UKGoldenEggKC",
         "worth": 27.41,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-08-04": [
      {
         "diff": -0.0005,
         "value1": 0.1995,
         "value2": 0.2,
         "currency": "BTC",
         "from": "From HKBybitBless",
         "to": "To HKBybitKC (DUPLICATE)",
         "worth": 6315.45,
         "wcurr": "USD",
         "type": "GIFT"
      },
      {
         "diff": -0.0005,
         "value1": 0.1995,
         "value2": 0.2,
         "currency": "BTC",
         "from": "From HKBybitBless",
         "to": "To HKBybitKC (DUPLICATE)",
         "worth": 6315.45,
         "wcurr": "USD",
         "type": "GIFT"
      }
   ],
   "2021-10-26": [
      {
         "diff": 2.5,
         "value1": 6353.7594,
         "value2": 6351.2594,
         "currency": "USDT",
         "from": "From HKKrakKC",
         "to": "To HKBybitBless",
         "worth": 6353.7594,
         "wcurr": "USDT",
         "type": "FORK"
      }
   ],
   "2021-11-04": [
      {
         "diff": 1,
         "value1": 550,
         "value2": 549,
         "currency": "USDT",
         "from": "To UKBinKC",
         "to": "To HKBybitBless",
         "worth": 550,
         "wcurr": "USDT",
         "type": "FORK"
      }
   ]
}`;
(function(json) {
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

/*
cutdown
{
    "id": "1541AB33FEC8101E2F2BF85AC4C634D5",
    "net_worth": {
        "amount": "2.1",
        "currency": {
            "id": 10,
            "symbol": "USD"
        }
    },
    "label": "fork",
    "description": "description here"
}

{
  "id": "9B32B95E8EDFA448A45C77C6E47EFE9D",
  "label": "gift",
  "description": "description here"
}



*/
    const changeTransaction_costbasis = async (TYPE, TRANSACTION, DATE, AMOUNT, CURRENCY_ID, COST_BASIS, OLD_COST_BASIS) => {
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




    const timer = ms => new Promise(res => setTimeout(res, ms))

    const run_costbasisfix = async (json) => {
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

    run_costbasisfix(json);

})(_data)