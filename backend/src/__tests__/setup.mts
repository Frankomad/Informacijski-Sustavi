import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const envPath = resolve(__dirname, '../../.env.local');

// Load test environment variables
dotenv.config({ path: envPath }); 