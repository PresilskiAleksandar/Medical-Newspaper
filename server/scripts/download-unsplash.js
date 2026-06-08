require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { downloadAll } = require('../services/unsplashDownloader');

downloadAll()
  .then(total => {
    console.log(`\nDownload complete: ${total} photos`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Download failed:', err);
    process.exit(1);
  });
