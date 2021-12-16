import { Magic } from "magic-sdk";

// Create client-side Magic instance
const createMagic = (key) => {
  if (typeof window != "undefined") {
    return new Magic(key);
  }
};
export const magic = createMagic("Your magic key");
