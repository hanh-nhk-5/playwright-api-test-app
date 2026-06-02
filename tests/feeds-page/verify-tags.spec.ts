import {test} from '../../src/fixtures/feeds.fixture';
import { expect } from '@playwright/test';

test('Landing page should have a list of tags in the sidebar', async({feedsPage}) =>{
    await expect(feedsPage.tagListLocator).toBeVisible();
});

test.describe('mock data for the tags API', () =>{    
    test.beforeEach(async ({page})=>{  
        page.route(`${process.env.API_BASE_URL}/api/tags`, route =>{
            const tags= {
                "tags": [
                    "Test",
                    "Blog"
                ]
            };
            route.fulfill({body: JSON.stringify(tags)});
        });
    })

    test('should display the tags from the API', async({feedsPage}) =>{
        await expect(feedsPage.tagListLocator).toHaveText(' Test  Blog ');
    })    
});

test.describe('change api response data', () =>{
    test.beforeEach(async ({page})=>{
        page.route(`${process.env.API_BASE_URL}/api/tags`, async route =>{
            const response= await route.fetch();
            const data = await response.json();
            data.tags.push('Custom tag bla bla');
            route.fulfill({body: JSON.stringify(data)});
        })
    })

    test('should display the custom tag in the UI', async({feedsPage})=>{
        await expect(feedsPage.tagListLocator).toContainText('Custom tag bla bla');
    })
});