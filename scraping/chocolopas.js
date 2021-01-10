const fs = require('fs');
const path = require('path');
module.exports = async (page, website) => {
    const { selectors } = website;
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
    await page.waitForSelector('#tb_01 > tr > td:nth-child(2) > table > thead > tr:nth-child(2) > td > a');
    await page.click('#tb_01 > tr > td:nth-child(2) > table > thead > tr:nth-child(2) > td > a');
    //select all categories
    await page.waitFor(1000);
    await page.waitForSelector('#tb_01 > tr > td > table > thead > tr:nth-child(2) > td > a');
    await page.click('#tb_01 > tr > td > table > thead > tr:nth-child(2) > td > a');
    //select "muestra"
    await page.waitForSelector('#tQuery_length > label > select')
    await page.select('select[name="tQuery_length"]', '100');
    // await page.waitForSelector('#tQuery');
    // Selected table by aria-label instead of div id
    const recordList = await page.$$eval('#tQuery', (trows) => {
        let rowList = []
        trows.forEach(row => {
            let record = { 'id': '', 'stock': '', 'price': '' } //definimos el arreglo 

            record.id = row.querySelector('td').innerText; // (tr < th < a) anchor tag text contains country name
            const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText); // getting textvalue of each column of a row and adding them to a list.
            record.stock = tdList[7];
            record.price = tdList[8];
            if (tdList.length >= 0) {
                rowList.push(record)
            }
        });
        return rowList;
    })
    console.log(recordList);
    fs.writeFileSync(
        path.join(__dirname, `${website.scriptName}.json`),
        JSON.stringify(recordList),
        'utf8'

    );

};