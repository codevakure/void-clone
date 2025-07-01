# Zap API File Format Specification

## Overview
The `.zap` file format is designed for storing API requests and collections in a human-readable text format that supports version control and collaboration.

## Collection Structure

```
my-api-collection/
├── zap.json                 # Collection configuration
├── collection.zap           # Collection-level settings (optional)
├── environments/            # Environment files
│   ├── development.zap
│   ├── staging.zap
│   └── production.zap
├── users/                   # Request groups (folders)
│   ├── group.zap            # Group-level settings (optional)
│   ├── get-users.zap
│   ├── create-user.zap
│   └── auth/
│       ├── group.zap
│       ├── login.zap
│       └── refresh-token.zap
└── products/
    ├── group.zap
    ├── list-products.zap
    └── create-product.zap
```

## File Types

### 1. Collection Configuration (`zap.json`)
```json
{
  "version": "1.0",
  "name": "My API Collection",
  "type": "collection",
  "description": "Sample API collection for testing",
  "baseUrl": "https://api.example.com",
  "ignore": ["node_modules", ".git", "*.log"]
}
```

### 2. Request File (`.zap`)
```zap
meta {
  name: Get User by ID
  type: http
  seq: 1
  description: Retrieves a user by their unique identifier
}

http {
  method: GET
  url: {{baseUrl}}/users/{{userId}}
}

query {
  include: profile,settings
  format: json
  ~debug: true
}

headers {
  Authorization: Bearer {{accessToken}}
  Accept: application/json
  X-Client-Version: 1.0.0
  ~X-Debug-Mode: enabled
}

auth {
  type: bearer
  token: {{authToken}}
}

auth:basic {
  username: {{username}}
  password: {{password}}
}

auth:apikey {
  key: X-API-Key
  value: {{apiKey}}
  in: header
}

body:json {
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}

body:text {
  This is plain text content
}

body:xml {
  <?xml version="1.0"?>
  <user>
    <name>John Doe</name>
    <email>john@example.com</email>
  </user>
}

body:form {
  name: John Doe
  email: john@example.com
  ~disabled_field: value
}

body:multipart {
  name: John Doe
  email: john@example.com
  avatar: @file(./avatar.jpg)
  ~optional_field: value
}

variables:request {
  timestamp: {{$timestamp}}
  requestId: {{$uuid}}
}

variables:response {
  userId: {{response.data.id}}
  userToken: {{response.headers.x-auth-token}}
}

script:before {
  // Pre-request script
  zap.setVariable("timestamp", Date.now());
  zap.setHeader("X-Request-ID", zap.uuid());
}

script:after {
  // Post-response script
  if (response.status === 200) {
    zap.setVariable("userId", response.data.id);
  }
}

tests {
  test("Response status should be 200", () => {
    expect(response.status).to.equal(200);
  });

  test("Response should contain user data", () => {
    expect(response.data).to.have.property("id");
    expect(response.data).to.have.property("name");
  });
}

docs {
  # Get User by ID

  This endpoint retrieves a user by their unique identifier.

  ## Parameters
  - `userId`: The unique identifier of the user

  ## Response
  Returns a user object with the following properties:
  - `id`: User ID
  - `name`: Full name
  - `email`: Email address
}
```

### 3. Group/Folder Settings (`group.zap`)
```zap
meta {
  name: User Management
  description: APIs for managing users
  seq: 1
}

variables {
  baseUrl: https://api.example.com/v1
  timeout: 30000
}

headers {
  Authorization: Bearer {{token}}
  Content-Type: application/json
}

auth:bearer {
  token: {{groupToken}}
}

script:before {
  // Group-level pre-request script
  console.log("Executing user management request");
}

script:after {
  // Group-level post-response script
  console.log("User management request completed");
}
```

### 4. Environment File (`development.zap`)
```zap
variables {
  baseUrl: https://dev-api.example.com
  authToken: dev_token_123
  apiKey: dev_api_key_456
  timeout: 5000
  debug: true
}
```

## Syntax Rules

### Basic Structure
- Blocks are defined with `blockname { ... }`
- Key-value pairs use `:` separator
- Comments start with `//` or `#`
- Disabled items are prefixed with `~`

### Variable Interpolation
- `{{variableName}}` - Environment/collection variables
- `{{$function}}` - Built-in functions (e.g., `{{$timestamp}}`, `{{$uuid}}`)
- `{{response.path}}` - Response data access

### Special Syntax
- `@file(path)` - File references for uploads
- `~key: value` - Disabled parameters/headers
- Multiline text blocks with proper indentation

### HTTP Methods
```zap
http {
  method: GET | POST | PUT | PATCH | DELETE | HEAD | OPTIONS
  url: https://example.com/api
}
```

### Authentication Types
- `auth:basic` - Basic authentication
- `auth:bearer` - Bearer token
- `auth:apikey` - API key authentication
- `auth:oauth2` - OAuth 2.0 (future)
- `auth:aws` - AWS Signature (future)

### Body Types
- `body:json` - JSON content
- `body:text` - Plain text
- `body:xml` - XML content
- `body:form` - Form URL encoded
- `body:multipart` - Multipart form data
- `body:binary` - Binary file upload

## Key Differences from Bruno

1. **File Extension**: `.zap` instead of `.bru`
2. **Configuration**: `zap.json` instead of `bruno.json`
3. **Group Files**: `group.zap` instead of `folder.bru`
4. **Syntax Variations**:
   - `http { method: GET }` instead of `get { }`
   - `auth:apikey { in: header }` with additional properties
   - `variables:request` and `variables:response` instead of `vars:pre-request`
   - `script:before` and `script:after` instead of `script:pre-request`
5. **Additional Features**:
   - Built-in variable functions
   - More structured auth blocks
   - Enhanced metadata

## Implementation Benefits

1. **Version Control Friendly**: Plain text format
2. **Human Readable**: Clear, structured syntax
3. **Collaborative**: Easy to merge and diff
4. **Extensible**: New block types can be added
5. **Tool Agnostic**: Can be used by multiple tools
6. **Self-Documenting**: Built-in documentation blocks
