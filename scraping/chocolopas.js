const fs = require('fs');
const path = require('path');
const page = 1; 
module.exports = async (page, website) =>{
    const {selectors} = website;
    await page.goto(website.url);
    //Login
    //select form to login
        await page.waitForSelector('#navbar > ul > li:nth-child(7) > a');
        await page.click('#navbar > ul > li:nth-child(7) > a');
        //enter user
        await page.waitForSelector('#Usuario');
        await page.type('#Usuario', '4637B_01');
        //enter pass
        await page.waitForSelector('#contrasena');
        await page.type('#contrasena', 'GugiGagr2686*');
        //select botton "send"
        await page.waitForSelector('#formularioLogIn > table > thead > tr:nth-child(5) > td > input');
        await page.click('#formularioLogIn > table > thead > tr:nth-child(5) > td > input');
        //select first brand
        await page.waitForSelector('#tb_01 > tr > td:nth-child(2) > table > thead > tr:nth-child(27) > td > a');
        await page.click('#tb_01 > tr > td:nth-child(2) > table > thead > tr:nth-child(27) > td > a');
        //select all categories
        await page.waitFor(1000);
        await page.waitForSelector('#tb_01 > tr > td > table > thead > tr:nth-child(2) > td > a');
        await page.click('#tb_01 > tr > td > table > thead > tr:nth-child(2) > td > a');
        await page.waitFor(1000);
        //select "muestra"
        await page.waitForSelector('#tQuery_length > label > select')
        await page.select('select[name="tQuery_length"]', '100');
        await page.waitForSelector('#tQuery');
        const recordList = await page.$$eval('#tQuery', (trows) => {
            let rowList = []
            let product = []
            trows.forEach(row => {
                const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText);
                for (let iterator = 0; iterator < tdList.length; iterator+=10) {
                product.push({
                    id: tdList[iterator + 0],
                    stock: tdList[ iterator + 7],
                    price: tdList[iterator + 8]
                }) 
            }
                if (tdList.length >= 3) {
                    rowList.push(product)
                }
            });
            return rowList;
        
        })
        scrapeAllPages(page)
fs.writeFileSync(
path.join(__dirname,`${website.scriptName}.json` ), 
JSON.stringify(recordList),
'utf8'

);

};

async function gotoNextPage(page, pageno) {
    let noMorePages = true;
    //let nextPageXp = `//tr[@class='PagerStyle']/td/table/tbody/tr/td/a[contains(@href,'Page$${pageno}')]`;
    let nextPageXp = `#tQuery_paginate > span > a:nth-child(${pageno})`;
    let currPageXp = `#tQuery_paginate > span > a.paginate_button.current`;
    let nextPage;

    nextPage = await page.$x(nextPageXp)
    
    if (nextPage.length > 0) {
        console.log(`Going to page ${pageno}`);
        
        await nextPage[0].click();
        await page.waitForXPath(currPageXp);
        
        noMorePages = false;
    }

    return noMorePages;    
}

async function scrapeAllPages(page) {
    let results = [];
    let pageno = 2;
    
    while (true) {
        console.log(`Scraping page ${pageno - 1}`);
        
        results = results.concat(
            await scrapeMemberTable(page)
        );

        const noMorePages = await gotoNextPage(page, pageno++)
        if (noMorePages) {
            break;
        }
    }

    /*
     * The pager won't reset back to page 1 on its own so we have to explicitly 
     * click on the page 1 link
     */
    await gotoFirstPage(page);
    return results;
}