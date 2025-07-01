meta {
  name: Get User Profile
  type: http
  seq: 1
  description: Retrieves the current user's profile information
}

http {
  method: GET
  url: {{baseUrl}}/api/v1/user/profile
}

headers {
  Authorization: Bearer {{accessToken}}
  Accept: application/json
  Content-Type: application/json
}

query {
  include: permissions,preferences
  format: json
}

auth {
  type: bearer
  token: {{authToken}}
}

tests {
  test("Response status should be 200", () => {
    expect(response.status).to.equal(200);
  });

  test("Response should contain user data", () => {
    expect(response.data).to.have.property("id");
    expect(response.data).to.have.property("username");
    expect(response.data).to.have.property("email");
  });
}

docs {
  # Get User Profile

  This endpoint retrieves the current user's profile information including their personal details, permissions, and preferences.

  ## Authentication
  Requires a valid Bearer token in the Authorization header.

  ## Response
  Returns a user object with the following properties:
  - `id`: User ID
  - `username`: User's login name
  - `email`: User's email address
  - `permissions`: Array of user permissions
  - `preferences`: User preference settings
}
