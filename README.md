# Passwordless authentication with Magic + Amplify

This repository showcases passwordless authentication with [Magic](https://magic.link/) and Amplify.

![magic_demo](https://user-images.githubusercontent.com/6277118/146285168-f0a2b596-b39e-4ded-a284-92efe0e8bf6f.gif)


# Note

1. This Ampify project does not work as it points to an environment that doesn't exist. Use this as a reference for your implementation.

2. In order to use the Frontend code, you need to set your own Magic Public Key

```
// src/lib/magic.js
export const magic = createMagic("Your magic key");
```
