const puppeteer = require('puppeteer');
const path = require('path');
const websites  = require('./websites.json');
const cron = require("node-cron");

//cron.schedule("* * * * *", () => {
    (async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        
        for (const website of websites) {
            const scriptPhat = path.join(__dirname,'scripts',website.scriptName);
             await require(scriptPhat)(page, website);
            console.log('Scraping done for', website.name);
            await page.waitFor(3000);
        await browser.close();
            
        }
       
    } )();
//}); 
