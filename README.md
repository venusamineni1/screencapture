# Screenshot Automation Script

A Node.js script to automate taking screenshots of websites using Playwright.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

## Setup on a New Machine

1. **Copy Files**: Ensure you have the following files in a directory:
   - `capture.js`
   - `package.json`
   - `package-lock.json`
   - `urls.txt` (optional, for batch processing)

2. **Install Dependencies**:
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```

3. **Verify Chrome Installation**:
   This script now uses the Google Chrome browser installed on your system. Make sure Google Chrome is installed.
   
   *Note: You do NOT need to run `npx playwright install` if you have Chrome installed.*

## Usage

### Basic Usage
Take a single screenshot of a URL:
```bash
node capture.js https://example.com
```

### Advanced Usage
```bash
node capture.js <input> [count] [interval_ms]
```

- **`input`**: URL string OR path to a text file containing URLs.
- **`count`**: Number of screenshots to take (default: 1).
- **`interval_ms`**: Time in milliseconds between screenshots (default: 1000).

### Batch Processing
Create a file (e.g., `urls.txt`) with one URL per line:
```text
https://google.com
https://github.com
```

Run the script:
```bash
node capture.js urls.txt 1
```

### Custom Chrome Path
If Chrome is installed in a non-standard location, you can specify the path using the `CHROME_PATH` environment variable:

**Mac/Linux:**
```bash
CHROME_PATH="/path/to/google/chrome" node capture.js https://example.com
```

**Windows:**
```bash
set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
node capture.js https://example.com
```

## Output
Screenshots are saved in the `screenshots/` directory.
