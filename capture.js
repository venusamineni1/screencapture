const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function waitWithCountdown(page, ms) {
    if (ms >= 1000) {
        let remaining = ms;
        while (remaining > 0) {
            process.stdout.write(`Waiting ${Math.ceil(remaining / 1000)}s... \r`);
            const step = Math.min(remaining, 1000);
            await page.waitForTimeout(step);
            remaining -= step;
        }
        process.stdout.write('\r\x1b[K');
    } else if (ms > 0) {
        await page.waitForTimeout(ms);
    }
}

async function capture() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node capture.js <url_or_file> [count] [interval_ms] [initial_wait_ms]');
        process.exit(1);
    }

    const input = args[0];
    const count = parseInt(args[1]) || 1;
    const interval = parseInt(args[2]) || 1000;
    const initialWait = parseInt(args[3]) || 0;

    let urls = [];
    try {
        if (fs.existsSync(input) && fs.lstatSync(input).isFile()) {
            console.log(`Reading URLs from file: ${input}`);
            const fileContent = fs.readFileSync(input, 'utf-8');
            urls = fileContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        } else {
            urls = [input];
        }
    } catch (err) {
        urls = [input];
    }

    if (urls.length === 0) {
        console.error('No URLs found to process.');
        process.exit(1);
    }

    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    // Use system Chrome if possible
    const launchOptions = {
        channel: 'chrome', // upgrades to finding existing chrome installation
        headless: true
    };

    // Allow manual override
    if (process.env.CHROME_PATH) {
        launchOptions.executablePath = process.env.CHROME_PATH;
        delete launchOptions.channel; // executablePath overrides channel
    }

    console.log('Launching browser (System Chrome)...');
    let browser;
    try {
        browser = await chromium.launch(launchOptions);
    } catch (e) {
        console.error('Failed to launch Chrome. Make sure Google Chrome is installed.');
        console.error('Error details:', e.message);
        console.error('You can also try setting CHROME_PATH environment variable to the executable path.');
        process.exit(1);
    }

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();

    for (const url of urls) {
        console.log(`\nProcessing URL: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'load' }); // Changed to 'load' to be safer, networkidle can be flaky
        } catch (e) {
            console.error(`Failed to navigate to ${url}: ${e.message}`);
            continue;
        }

        if (initialWait > 0) {
            console.log(`Initial wait of ${initialWait}ms...`);
            await waitWithCountdown(page, initialWait);
        }

        // Sanitize URL for filename
        const urlSanitized = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');

        for (let i = 0; i < count; i++) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = path.join(screenshotsDir, `${urlSanitized}-${timestamp}-${i + 1}.png`);

            await page.screenshot({ path: filename, fullPage: true });
            console.log(`Saved: ${filename}`);

            if (i < count - 1) {
                await waitWithCountdown(page, interval);
            }
        }
    }

    await browser.close();
    console.log('\nAll done.');
}

capture();
