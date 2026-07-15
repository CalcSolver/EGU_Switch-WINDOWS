const https = require('https');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const CURRENT_VERSION = '1.0.0'; 
const REPO = 'CalcSolver/EGU_Switch';
const OUTPUT_FILE = path.join(__dirname, 'latest_release.zip');

const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases/latest`,
    headers: { 'User-Agent': 'NodeJS-Update-Checker' }
};

console.log('🔍 Checking GitHub for updates...');

https.get(options, (res) => {
    let data = '';

    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
        try {
            const release = JSON.parse(data);
            
            if (!release.tag_name) {
                console.log('❌ Could not retrieve latest release information.');
                return;
            }

            const latestVersion = release.tag_name.replace(/v/gi, '');

            console.log(`----------------------------------------`);
            console.log(`📦 Local Version:  ${CURRENT_VERSION}`);
            console.log(`🚀 Latest Release: ${latestVersion}`);
            console.log(`----------------------------------------`);

            if (latestVersion !== CURRENT_VERSION) {
                console.log('✨ A new update is available!');
                
                // Locate the first available asset or fall back to the source zip
                const downloadUrl = release.assets && release.assets.length > 0 
                    ? release.assets[0].browser_download_url 
                    : release.zipball_url;

                if (downloadUrl) {
                    downloadUpdate(downloadUrl);
                } else {
                    console.log('❌ No download link found for this release.');
                }
            } else {
                console.log('✅ Your software is already up to date.');
            }
        } catch (error) {
            console.error('❌ Failed to parse server response:', error.message);
        }
    });

}).on('error', (err) => {
    console.error('❌ Network error during update check:', err.message);
});

// DOWNLOAD HANDLER (Handles HTTP 302 Redirections safely)
function downloadUpdate(url) {
    console.log('⏳ Starting download...');
    
    https.get(url, { headers: { 'User-Agent': 'NodeJS-Update-Checker' } }, (res) => {
        // Handle GitHub CDN redirects
        if (res.statusCode === 302 || res.statusCode === 301) {
            downloadUpdate(res.headers.location);
            return;
        }

        if (res.statusCode !== 200) {
            console.log(`❌ Download failed. Server responded with status: ${res.statusCode}`);
            return;
        }

        const fileStream = fs.createWriteStream(OUTPUT_FILE);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`🎉 Update successfully downloaded to: ${OUTPUT_FILE}`);
        });
    }).on('error', (err) => {
        console.error('❌ Error downloading asset:', err.message);
    });
}
