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

3. **Install Browsers**:
   Playwright needs to download its browser binaries:
   ```bash
   npx playwright install
   ```

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

## Output
Screenshots are saved in the `screenshots/` directory.
