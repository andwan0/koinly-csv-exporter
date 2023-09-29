//kgpo
/*var aWallets = [
    'CC103A754D200AFBB86C40455A279A6E',//u1.0
    'BF085FF90A02EF45CBD2B0625075A568',//u3.0
    'D4A7B703E955567AF69C27947E15E525',//u3.1
    '57FBEC072CBE4D87CAA046AEB207CC5A',//u4.0
    '6FAF561D6E5671D55EFBBCC88A930DAC',//u4.1
];*/

//kwmc
var aWallets = [
    '2BFDB9FA3FD5E6C6283409C8BBB3114A',//h1.0
    /*'76B991427D3BC60D4986FEA7C2D2752E',//h2.0
    'E00EA4C2A12B3C8032A93589ED6CD3CC',//h2.1
    'C14273C8DBE829AD20DDE760E5CBE17E',//h2.2
    '9AA7D94483F62F5EDE1C831090A8FE25',//h2.3
    '569035255FF7939527A38C9943E0F983',//h2.4
    '393A09AD4F264128C02BE12CE109EB0A',//h2.5
    'ABF7DAEB9365FE4790F262B84FB6D50E',//h2.6
    '806921AE55D7E95BA604DBC95EBD1514',//h3.0
    '088E3684F25F347AE1BED97C48BBD30F',//h3.1
    '15B27A9AD59550723F199D663A3A0030',//h3.2
    'ED7EE569E1A3EDF1DC8FF8361E073AA1',//h3.3
    'D44575FB85B4EE9E37C2CCC3C1DF1B13',//h3.4
    'E9B4CA29DFAB749D6638391E9ACB3EBC',//h3.5*/
];


//and
/*var aWallets = [
    'D2EB0018CEDBA8BB986953D253BBCF33',//h1.0

    'F306B7FD434358A5BB6019D2EBD7322B',//h2.0
    '4BA466DFE6B691F70D5641DEEC18CB69',//h2.1
    '03010ED1652DE064BC1B798E09F173EE',//h2.2
    '6605A870C1DEC7D620C44BA657449FAD',//h2.3
    '55AC05B5A717D0511AD6D247E58CB6AA',//h2.4
    'BB936F4C0F47CF246F80E950DB9159E9',//h2.5
    '50B22EE10BF0C67EE92530592EF20FAB',//h2.6

    '8A6E76815B5B35AF9638D1BD5CC591DD',//h3.0
    'FD1D72583BD521E98F0BA94997DB860E',//h3.1
    '06C17144722D3564BD67C92419EE2E17',//h3.2
    '39016DEBB7FA3F825B511678F2373500',//h3.3
    '8E8DC1B384146A01CE6B32784FE73CF6',//h3.4
    '561019545B49F0EE3078D8A647290E29',//h3.5

    'A03F059DE6DC86574E1D6AFD7FEB72AB',//u1.0

    '83050F619380F952F8E44E76DD867EC9',//u3.0
    '5F2997A01D56FB858D0CA3F6A095B08A',//u3.1
    
    'E75D7E14736D4D3D12CD8551209EB297',//u4.0
    'F958BA9230C057B13154324B15467AF3',//u4.1
];*/

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

    const toCSVFile = (baseCurrency, transactions, id, name) => {  
   
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
        const transactions = await getAllTransactions(wallet);
        console.log('Your Koinly Transactions\n', transactions);
        toCSVFile(baseCurrency, transactions, wallet, dict[wallet]);
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
})(aWallets)