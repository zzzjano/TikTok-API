# TikTok API

A secure Node.js API service for fetching TikTok data through Tor network. This service provides anonymous access to TikTok data with built-in safety measures and request management.

## Features

- Fetch TikTok user profiles
- Get video details
- Retrieve user posts
- Extract Aweme IDs from TikTok URLs
- Request queueing system
- Tor network integration for anonymity
- Automatic session rotation
- Error handling and retries

## Prerequisites

- Node.js (v14 or higher)
- Tor service running locally
- npm or yarn

## Quick Start

1. Clone the repository
```sh
git clone https://github.com/zzzjano/tiktok-api.git
cd tiktok-api
```

2. Install dependencies
```sh
npm install
```

3. Set up your environment variables
```sh
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```sh
npm start
```

## API Endpoints

### User Profile
```http
GET /api/tiktok/profile/:username
```

### Video Details
```http
GET /api/tiktok/video/:videoId
```

### User Posts
```http
GET /api/tiktok/posts/:secUid
```
Query parameters:
- `cursor` (default: 0)
- `count` (default: 35)
- `coverFormat` (default: 2)

### Aweme ID Extraction
```http
GET /api/tiktok/awemeid?url=tiktok_video_url
```

## Usage Examples

```javascript
// Fetch user profile
fetch('http://localhost:8083/api/tiktok/profile/username')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Security

- Tor network routing for all requests
- Automatic IP rotation
- Rate limiting and request queuing
- Session management
- Request sanitization
- Error handling with retries

## Error Handling

The API implements comprehensive error handling for:
- TikTok API errors
- Network issues
- Rate limiting
- Invalid requests

See `errorCodes.js` for the complete list of error codes and their handling.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC