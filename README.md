# Passwordless authentication with Magic + Amplify

This repository showcases passwordless authentication with [Magic](https://magic.link/) and Amplify.

# Note

1. This Ampify project does not work as it points to an environment that doesn't exist. Use this as a reference for your implementation.

2. In order to use frontend, you need to set your own Magic Public Key

```
// src/lib/magic.js
export const magic = createMagic("Your magic key");
```
