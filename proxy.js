const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Serve queue.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'queue.html'));
});

// Cache the queue count
let cachedCount = 0;
let lastUpdate = 0;
const CACHE_DURATION = 5000; // 5 seconds

async function getQueueCount() {
    const now = Date.now();
    if (now - lastUpdate < CACHE_DURATION) {
        return cachedCount;
    }

    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--deterministic-fetch',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials'
            ]
        });
        
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        
        await page.goto('https://app.fastget.com.br/#/panel/d55420f6-b1b2-11ef-9f40-029e72b0772d/QUEUE', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await page.waitForTimeout(5000);
        
        const count = await page.evaluate(() => {
            const queueItems = document.querySelectorAll('div.item.font-bold');
            return queueItems.length;
        });

        cachedCount = count;
        lastUpdate = now;
        
        return count;
    } catch (error) {
        console.error('Error fetching queue count:', error);
        
        if (error.name === 'TimeoutError' || 
            error.message.includes('timeout') || 
            error.message.includes('navigation')) {
            cachedCount = 0;
            lastUpdate = now;
            return 0;
        }
        
        return cachedCount;
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                console.error('Error closing browser:', error);
            }
        }
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/queue-count', async (req, res) => {
    try {
        const forceRefresh = req.query.force === 'true';
        if (forceRefresh) {
            lastUpdate = 0; // Clear cache
        }
        
        const count = await getQueueCount();
        res.json({ count });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to get queue count' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 