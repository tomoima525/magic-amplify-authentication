# Passwordless authentication with Magic + Amplify

This repository showcases passwordless authentication with [Magic](https://magic.link/) and Amplify.

![magic_demo](https://user-images.githubusercontent.com/6277118/146285168-f0a2b596-b39e-4ded-a284-92efe0e8bf6f.gif)

# Auth flow
![Screen Shot 2021-12-15 at 2 04 20 PM](https://user-images.githubusercontent.com/6277118/146292185-f15a5059-0e45-4803-bb81-33927468ce1e.png)

- User inputs an email address and requests credentials from Magic through Email
- Using `didtoken` and `issuer` id received as a callback, the client application calls Lambda function through API for Authentication
- Backend Lambda function accesses Cognito Federated Identity and returns OpenID token(`Token` and `Identity`) to the client side
- The client application then signup with OpenID. Cognito Federated Idenitity authorize users to access AWS services.

# Note

1. This Ampify project does not work as it points to an environment that doesn't exist. Use this as a reference for your implementation.

2. In order to use the Frontend code, you need to set your own Magic Public Key

```
// src/lib/magic.js
export const magic = createMagic("Your magic key");
```
