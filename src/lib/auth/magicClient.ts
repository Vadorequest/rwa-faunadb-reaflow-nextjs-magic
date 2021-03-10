const { Magic } = require('magic-sdk');
import { isBrowser } from '@unly/utils';

/**
 * Initialize a Magic Link client instance (on the browser).
 *
 * Acts as a singleton.
 * Won't crash if called on the server (universal).
 *
 * @see https://docs.magic.link/client-sdk/web/get-started#create-an-sdk-instance
 */
export const magicClient = isBrowser() ? new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) : null;
