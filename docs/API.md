# 🎃 GhostFrame API Documentation

Complete API reference for the GhostFrame backend.

**Base URL:** `http://localhost:3001/api`  
**Version:** 1.0.0

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Marketplace](#marketplace)
- [Reviews](#reviews)
- [Modules](#modules)
- [Upload](#upload)
- [AI Generation](#ai-generation)
- [Admin](#admin)

---

## 🔐 Authentication

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

### POST /auth/login

Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### POST /auth/logout

Logout and invalidate token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## 🛒 Marketplace

### GET /marketplace/modules

Search and filter marketplace modules.

**Query Parameters:**
- `query` (string) - Search query
- `categories` (string) - Comma-separated categories
- `tags` (string) - Comma-separated tags
- `minRating` (number) - Minimum rating (0-5)
- `pricing` (string) - Pricing type (free, freemium, paid)
- `sortBy` (string) - Sort field (downloads, rating, recent, trending)
- `order` (string) - Sort order (asc, desc)
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 20)

**Example:**
```
GET /marketplace/modules?query=quiz&categories=education&sortBy=downloads&order=desc
```

**Response:** `200 OK`
```json
{
  "modules": [
    {
      "id": "quiz-ghost",
      "name": "Quiz Ghost",
      "description": "AI-powered quiz generation",
      "version": "1.0.0",
      "authorProfile": {
        "id": "uuid",
        "name": "GhostFrame Team",
        "username": "ghostframe"
      },
      "marketplace": {
        "downloads": 1247,
        "weeklyDownloads": 156,
        "featured": true,
        "publishedAt": "2025-01-01T00:00:00Z"
      },
      "ratings": {
        "average": 4.8,
        "count": 156
      },
      "tags": ["education", "quiz", "ai"],
      "categories": ["education"],
      "pricing": {
        "type": "free"
      }
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3,
  "facets": {
    "categories": [
      { "name": "education", "count": 15 },
      { "name": "productivity", "count": 12 }
    ],
    "tags": [
      { "name": "ai", "count": 25 },
      { "name": "quiz", "count": 8 }
    ]
  }
}
```

### GET /marketplace/featured

Get featured and trending modules.

**Response:** `200 OK`
```json
{
  "featured": [...],
  "trending": [...],
  "topDownloads": [...],
  "recentlyAdded": [...],
  "editorsPick": [...]
}
```

### GET /marketplace/modules/:id

Get detailed module information.

**Response:** `200 OK`
```json
{
  "module": {
    "id": "quiz-ghost",
    "name": "Quiz Ghost",
    "description": "AI-powered quiz generation",
    "version": "1.0.0",
    "readme": "# Quiz Ghost\n\n...",
    "changelog": "## [1.0.0]\n- Initial release",
    "authorProfile": {...},
    "marketplace": {...},
    "ratings": {...},
    "compatibility": {
      "frameworkVersion": "^1.0.0",
      "dependencies": [
        { "name": "openai", "version": "^4.0.0" }
      ]
    }
  },
  "relatedModules": [...],
  "authorModules": [...]
}
```

### POST /marketplace/publish

Publish module to marketplace.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "moduleId": "my-module",
  "marketplaceMetadata": {
    "tags": ["education", "quiz"],
    "categories": ["education"],
    "license": "MIT",
    "readme": "# My Module\n\n...",
    "changelog": "## [1.0.0]\n- Initial release",
    "supportUrl": "https://github.com/user/module",
    "documentationUrl": "https://docs.example.com",
    "demoUrl": "https://demo.example.com"
  }
}
```

**Response:** `200 OK`
```json
{
  "status": "published",
  "marketplaceUrl": "/marketplace/module/my-module",
  "checklist": {
    "securityScan": { "passed": true, "message": "Security scan passed" },
    "qualityCheck": { "passed": true, "message": "Quality standards met" },
    "documentationReview": { "passed": true, "message": "Documentation provided" },
    "kiroCompliance": { "passed": true, "message": "Kiro integration verified" },
    "licenseValidation": { "passed": true, "message": "License specified" },
    "metadataComplete": { "passed": true, "message": "Metadata validation" }
  }
}
```

### POST /marketplace/modules/:id/install

Track module installation.

**Response:** `200 OK`
```json
{
  "status": "installed",
  "installationId": "install-1234567890",
  "instructions": {
    "steps": [
      "Download module package",
      "Extract to modules directory",
      "Install dependencies",
      "Configure module settings"
    ],
    "cliCommands": [
      "ghostframe marketplace install quiz-ghost",
      "cd modules/quiz-ghost",
      "npm install"
    ]
  }
}
```

---

## ⭐ Reviews

### POST /marketplace/modules/:id/review

Submit a review for a module.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "rating": 5,
  "title": "Excellent module!",
  "content": "This module works perfectly and is very easy to use. Highly recommended!",
  "moduleVersion": "1.0.0"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "review": {
    "id": "uuid",
    "moduleId": "quiz-ghost",
    "userId": "uuid",
    "userName": "John Doe",
    "rating": 5,
    "title": "Excellent module!",
    "content": "This module works perfectly...",
    "verified": false,
    "helpful": 0,
    "createdAt": "2025-12-03T10:00:00Z"
  }
}
```

**Validation:**
- Rating: 1-5 (required)
- Title: 3-100 characters (required)
- Content: 20-2000 characters (required)

### GET /marketplace/modules/:id/reviews

Get reviews for a module.

**Query Parameters:**
- `sortBy` (string) - Sort by (recent, helpful, rating_high, rating_low)
- `limit` (number) - Max results (default: 50)

**Response:** `200 OK`
```json
{
  "reviews": [...],
  "total": 156,
  "averageRating": 4.8,
  "distribution": {
    "1": 2,
    "2": 5,
    "3": 15,
    "4": 45,
    "5": 89
  }
}
```

### PUT /marketplace/reviews/:id/helpful

Mark review as helpful.

**Response:** `200 OK`
```json
{
  "success": true,
  "helpful": 15
}
```

---

## 📦 Modules

### POST /modules/validate

Validate module configuration.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "moduleId": "my-module",
  "config": {
    "id": "my-module",
    "name": "My Module",
    "version": "1.0.0",
    "inputSchema": {...},
    "outputSchema": {...}
  }
}
```

**Response:** `200 OK`
```json
{
  "isValid": true,
  "score": 95,
  "errors": [],
  "warnings": [
    {
      "code": "MISSING_TESTS",
      "message": "No test files found",
      "suggestion": "Add tests for better quality"
    }
  ]
}
```

---

## 📤 Upload

### POST /upload

Upload and process file.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request:**
```
file: (binary)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "filename": "document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf"
  },
  "extracted": {
    "text": "Extracted content...",
    "wordCount": 1500,
    "pageCount": 5
  }
}
```

**Supported Formats:**
- PDF (.pdf)
- Word (.docx)
- Text (.txt)
- HTML (.html)

**Limits:**
- Max file size: 10MB
- Rate limit: 20 uploads/hour

---

## 🤖 AI Generation

### POST /ai/generate-quiz

Generate quiz from content.

**Request:**
```json
{
  "content": "The Earth orbits the Sun...",
  "options": {
    "questionCount": 10,
    "difficulty": "medium",
    "questionTypes": ["multiple-choice", "true-false"]
  }
}
```

**Response:** `200 OK`
```json
{
  "quiz": {
    "title": "Generated Quiz",
    "questions": [
      {
        "type": "multiple-choice",
        "question": "What does the Earth orbit?",
        "options": ["The Sun", "The Moon", "Mars", "Jupiter"],
        "correctAnswer": 0,
        "explanation": "The Earth orbits the Sun in our solar system."
      }
    ]
  }
}
```

### POST /ai/generate-story

Generate story from content.

**Request:**
```json
{
  "content": "Educational content...",
  "options": {
    "genre": "educational",
    "length": "medium",
    "audience": "teens"
  }
}
```

**Response:** `200 OK`
```json
{
  "story": {
    "title": "The Adventure of Learning",
    "story": "Once upon a time...",
    "characters": ["Alex", "Sam"],
    "themes": ["Learning", "Discovery"],
    "summary": "A story about..."
  }
}
```

---

## 🛡️ Admin

### POST /marketplace/modules/:id/report

Report a module.

**Request:**
```json
{
  "type": "malware",
  "description": "This module contains suspicious code",
  "evidence": ["line 45 in index.js"]
}
```

**Response:** `200 OK`
```json
{
  "reportId": "uuid",
  "status": "submitted",
  "message": "Report submitted successfully"
}
```

---

## 📊 Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚡ Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- File uploads: 20 uploads per hour
- Publishing: 10 publishes per day
- Reviews: 10 reviews per hour

---

## 🧪 Testing

Use the health check endpoint to verify API availability:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "alive",
  "message": "👻 GhostFrame backend is haunting successfully!",
  "timestamp": "2025-12-03T10:00:00Z"
}
```

---

## 📝 Examples

### Complete Workflow

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"pass123","name":"User"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}' \
  | jq -r '.token')

# 3. Search modules
curl http://localhost:3001/api/marketplace/modules?query=quiz

# 4. Get module details
curl http://localhost:3001/api/marketplace/modules/quiz-ghost

# 5. Submit review
curl -X POST http://localhost:3001/api/marketplace/modules/quiz-ghost/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"title":"Great!","content":"This module is excellent and very useful."}'

# 6. Install module
curl -X POST http://localhost:3001/api/marketplace/modules/quiz-ghost/install \
  -H "Authorization: Bearer $TOKEN"
```

---

**API Version:** 1.0.0  
**Last Updated:** December 3, 2025  
**Base URL:** http://localhost:3001/api

For more information, visit: https://docs.ghostframe.dev
