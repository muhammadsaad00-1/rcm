import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        
        console.log('Navigating to http://localhost:3000');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/0f0a4c00-3f6c-4ba7-a3d7-0a73c727acc7/landing_hero.png', fullPage: false });
        console.log('Hero screenshot saved correctly.');
        
        await page.evaluate(() => window.scrollBy(0, 800));
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/0f0a4c00-3f6c-4ba7-a3d7-0a73c727acc7/landing_features.png', fullPage: false });
        console.log('Features screenshot saved correctly.');
        
        await browser.close();
    } catch (e) {
        console.error('Failed to capture screenshot:', e);
    }
})();
