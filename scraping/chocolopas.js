const fs = require('fs');
const path = require('path');
module.exports = async (page, website) =>{
    const {selectors} = website;
    await page.goto(website.url);
    //Login
        await page.waitForSelector('#Usuario');
        await page.type('#Usuario', '4637B_01');
        await page.waitForSelector('#contrasena');
        await page.type('#contrasena', 'GugiGagr2686*');
        await page.waitForSelector('#formularioLogIn > table > thead > tr:nth-child(5) > td > input');
        await page.click('#formularioLogIn > table > thead > tr:nth-child(5) > td > input');
    //Selecciona el link para mostrar los productos
        await page.waitForSelector(selectors.trendsLink);
        await page.click(selectors.trendsLink);
        await page.goto("http://insta.ddns.net/installantas/ProductosCliente4/list?pagesize=-1");
        await page.waitFor(1000); 
        await page.waitForSelector(selectors.trendListTag);
        const trendsText =  await page.evaluate((trendListTag) => {
      const trendList = document.querySelectorAll(trendListTag);
      //console.log(trendList);
        const trendsText = [];
      for (const trend of trendList) {
          trendsText.push(trend.innerText);
          //console.log(trend.innerText);
          
      }
      return trendsText;
  }, selectors.trendListTag);
  //console.log(trendsText);
  let content = [];
  let columns = null;
  const regExp = new RegExp('[A-z]+');
  for (let text of trendsText) {
      const trends = [];
     // text = text.replace('\n', '');
      //const textSplited = text.split('\t');
     // const textSplited = text.split('\n').filter((txt) => regExp.test(txt));
     text = text.replace(/\n/g,'\t');
     columns = text.split(/\t/);
      for (let iterator = 0; iterator < columns.length; iterator+=17) {


        content.push({
            sku: columns[iterator + 3],
            name: "Llanta: " + columns[iterator + 4],
            short_description: "Marca: " + columns[iterator + 9],
            regular_price: columns[iterator + 14],
            altura: columns[iterator + 7], 
            ancho: columns[iterator + 6],
            rin: columns[iterator + 8],
            dimensions:{
                length: '',
                width:  'Ancho: ' + (columns[iterator + 6]),
                height: 'Alto: '  + (columns[iterator + 7])
            },
            attributes:[{
                id:4,
            name:"Modelo",
            position: 1,
            visible: true,
            variation: false,
            options:[columns[iterator + 10]]
         },
        {
            id:5,
            name: "Rango",
            position: 1,
            visible: true,
            variation: false,
            options:[columns[iterator + 11]]
        },
        {
            id:5,
            name: "Rin",
            position: 1,
            visible: true,
            variation: false,
            options:[columns[iterator + 8]]
        },
        {
            id:5,
            name: "Tipo",
            position: 1,
            visible: true,
            variation: false,
            options:[columns[iterator + 5]]
        },
        {
            id:6,
            name:"Capas",
            position: 1,
            visible: true,
            variation: false,
            options:[columns[iterator +12]]
        },
        {
            id: 7, 
            name: "Piso", 
            position: 1,
            visible: true, 
            variation: false, 
            options: [columns[iterator + 13]]
        },
        {
            id:9,
            name:"Stock",
            position: 1,
            visible: true,
            variation: false,
            options:[ columns[iterator + 15]]
        }],               
        categories: [
            {
              id: 15
            },
        ],
            images: [
                {
                
                },
              ]
       })
}

console.log(content);

}
fs.writeFileSync(
path.join(__dirname,`${website.scriptName}.json` ), 
JSON.stringify(content),
'utf8'

);

};