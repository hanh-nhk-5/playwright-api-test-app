import {test as base} from "@playwright/test";
import { PageManager } from "../pages/manager.page";
import fs from 'fs';

export const test= base.extend<{ pageManager: PageManager }>({
    request: async ({playwright}, use) => {
        const token =getJwtTokenFromAuthState();
        const requestContext = await playwright.request.newContext({
            baseURL: process.env.API_BASE_URL,
            extraHTTPHeaders: token? {Authorization: `Token ${token}`} : undefined,
        });
        await use(requestContext);
        await requestContext.dispose();
    },

    pageManager: async ({page}, use) =>{
        await page.goto('/');
        const pageManager = new PageManager(page);
        await use(pageManager);
    }
});

function getJwtTokenFromAuthState(): string | undefined {
    const authFilePath = process.env.AUTHENTICATION_FILE_PATH || 'src/.auth/user.json';
    const authState = JSON.parse(fs.readFileSync(authFilePath, 'utf8')) as {
        origins?: Array<{
            localStorage?: Array<{ name: string; value: string }>;
        }>;
    };

    for (const origin of authState.origins || []) {
        const tokenEntry = (origin.localStorage || []).find(item => item.name === 'jwtToken');
        if (tokenEntry?.value) {
            return tokenEntry.value;
        }
    }

    return undefined;
}