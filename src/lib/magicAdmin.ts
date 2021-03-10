import { isBrowser } from '@unly/utils';
const { Magic } = require('@magic-sdk/admin');

/**
 * Initialize a Magic Link admin instance (on the server).
 *
 * Acts as a singleton.
 * Won't crash if called on the browser (universal).
 *
 * @see https://docs.magic.link/admin-sdk/node/get-started#installation
 */
export const magicAdmin = !isBrowser() ? new Magic(process.env.MAGIC_SECRET_KEY) : null;
