# TikTok API

A professional Node.js API service for fetching TikTok data with optional Tor network integration to bypass IP blocking. This service provides reliable access to TikTok data with built-in rate limiting, request queuing, and comprehensive error handling.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)

## Features

- 🌐 **Bypass IP Blocks** - Optional Tor network routing to avoid TikTok IP blocking
- 📊 **User Profiles** - Fetch detailed TikTok user information
- 🎥 **Video Details** - Get comprehensive video data
- 📝 **User Posts** - Retrieve user's post history
- 🔗 **Aweme ID Extraction** - Extract video IDs from TikTok URLs
- ⏱️ **Request Queue** - Built-in request queueing with configurable delays
- 🔄 **Auto Retry** - Automatic retry mechanism with configurable attempts
- 🛡️ **Error Handling** - Comprehensive error handling with detailed messages
- 🔐 **IP Rotation** - Automatic IP rotation with Tor control port

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- (Optional) Tor service for anonymous requests

### Installing Tor (Optional - for bypassing IP blocks)

If you're experiencing IP blocking from TikTok, you can enable Tor routing:

**Windows:**
```powershell
# Download Tor Expert Bundle from https://www.torproject.org/download/tor/
# Or use Chocolatey:
choco install tor
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install tor
sudo systemctl start tor
```

**macOS:**
```bash
brew install tor
brew services start tor
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/zzzjano/TikTok-API.git
cd TikTok-API
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file with appropriate values

5. Add your TikTok cookies to `cookies.txt` (required)

6. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

### Environment Variables

Edit the `.env` file to configure the service:

```env
# Server Configuration
PORT=8083

# Tor Configuration
USE_TOR=false                    # Enable/disable Tor routing
TOR_HOST=127.0.0.1
TOR_PORT=9050
TOR_CONTROL_PORT=9051
TOR_CONTROL_PASSWORD=your_password
TOR_ENABLE_CONTROL_PORT=false    # Enable Tor session rotation

# API Configuration
REQUEST_DELAY_MS=5000            # Minimum delay between requests
MAX_RETRIES=3                    # Maximum retry attempts
RETRY_TIMEOUT_MS=5000            # Timeout before retry
```

### Cookies Configuration

Create a `cookies.txt` file in the root directory with your TikTok cookies. This is required for the API to work properly.

## Usage

### Starting the Server

```bash
npm start
```

The server will start on `http://localhost:8083` (or the port specified in `.env`)

### Making Requests

All API endpoints are prefixed with `/api/tiktok`

Example using curl:
```bash
curl http://localhost:8083/api/tiktok/users/username
```

Example using JavaScript:
```javascript
const response = await fetch('http://localhost:8083/api/tiktok/users/username');
const data = await response.json();
console.log(data);
```

## API Endpoints

### 1. Get User Profile

Fetch detailed information about a TikTok user.

```http
GET /api/tiktok/users/:username
```

**Parameters:**
- `username` (path) - TikTok username

**Example:**
```bash
curl http://localhost:8083/api/tiktok/users/tiktok
```

**Response:**
```json
{
  "data": {
    "statusCode": 0,
    "userInfo": {
      "user": {
        "id": "...",
        "uniqueId": "tiktok",
        "nickname": "TikTok"
      }
    }
  }
}
```

### 2. Get Video Details

Retrieve detailed information about a specific video.

```http
GET /api/tiktok/videos/:videoIdentifier
```

**Parameters:**
- `videoIdentifier` (path) - Video ID or full TikTok video URL

**Examples:**
```bash
# Using video ID
curl http://localhost:8083/api/tiktok/videos/7234567890123456789

# Using full URL
curl http://localhost:8083/api/tiktok/videos/https://www.tiktok.com/@user/video/7234567890123456789
```

**Response:**
```json
{
  "data": {
    "statusCode": 0,
    "itemInfo": {
      "itemStruct": {
        "id": "...",
        "desc": "Video description",
        "author": {...}
      }
    }
  }
}
```

### 3. Get User Posts

Fetch a user's posts/videos.

```http
GET /api/tiktok/users/:secUid/posts
```

**Parameters:**
- `secUid` (path, required) - User's secUid
- `cursor` (query, optional) - Pagination cursor (default: 0)
- `count` (query, optional) - Number of posts to fetch (default: 35)
- `coverFormat` (query, optional) - Cover image format (default: 2)

**Example:**
```bash
curl "http://localhost:8083/api/tiktok/users/MS4wLjABAAAA.../posts?cursor=0&count=20"
```

**Response:**
```json
{
  "data": {
    "statusCode": 0,
    "itemList": [...],
    "hasMore": true,
    "cursor": "20"
  }
}
```

### 4. Extract Aweme ID from URL

Extract the video ID (awemeId) from a TikTok URL.

```http
GET /api/tiktok/awemeid?url=<tiktok_url>
```

**Parameters:**
- `url` (query, required) - Full TikTok video or photo URL

**Example:**
```bash
curl "http://localhost:8083/api/tiktok/awemeid?url=https://www.tiktok.com/@user/video/7234567890123456789"
```

**Response:**
```json
{
  "data": "7234567890123456789"
}
```

## Error Handling

The API implements comprehensive error handling with detailed error messages.

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - User/video doesn't exist |
| 500 | Internal Server Error |
| 10202 | USER_NOT_EXIST |
| 10204 | VIDEO_NOT_EXIST |
| 10221 | USER_BAN |
| 10222 | USER_PRIVATE |

### Error Response Format

```json
{
  "error": "Error message description"
}
```

For a complete list of TikTok API error codes, see `utils/errorCodes.js`

## Features & Security

- 🔐 **Cookie Management** - Secure cookie storage and sanitization
- 🌐 **Tor Integration** - Optional routing through Tor to bypass IP blocks
- 🔄 **IP Rotation** - Automatic IP rotation with Tor control port
- ⏱️ **Rate Limiting** - Built-in request queue with configurable delays
- 🛡️ **Input Validation** - Request parameter validation middleware
- 🚫 **Error Handling** - Comprehensive error handling and retry logic

## Project Structure

```
TikTok-API/
├── app.js                      # Main application entry point
├── config/
│   └── torConfig.js           # Tor proxy configuration
├── controllers/
│   └── tiktokController.js    # Request handlers
├── middleware/
│   ├── errorHandler.js        # Global error handling
│   ├── requestLogger.js       # Request logging
│   └── validateAwemeUrl.js    # URL validation
├── routes/
│   └── tiktokRoutes.js        # API route definitions
├── services/
│   ├── tiktokService.js       # TikTok API business logic
│   └── torService.js          # Tor service management
└── utils/
    ├── cookieManager.js       # Cookie handling
    ├── errorCodes.js          # TikTok error code mappings
    ├── requestHelper.js       # HTTP request utilities
    ├── requestQueue.js        # Request queue implementation
    ├── sessionParams.js       # Session parameter generation
    ├── tiktokEndpoints.js     # API endpoint definitions
    ├── xbogus.js             # X-Bogus signature generation
    └── xgnarly.js            # X-Gnarly signature generation
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes appropriate comments and documentation
- Doesn't break existing functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for educational and research purposes only. Users are responsible for complying with TikTok's Terms of Service and applicable laws. The authors are not responsible for any misuse of this software.

## Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Tor integration via [Tor Project](https://www.torproject.org/)
- X-Bogus and X-Gnarly signature generation

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/zzzjano/TikTok-API/issues)
- Check existing issues for solutions

---

Made with ❤️ by [zzzjano](https://github.com/zzzjano)


1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC