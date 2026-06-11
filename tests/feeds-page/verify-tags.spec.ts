import {test} from '../../src/fixtures/feeds.fixture';
import { expect } from '@playwright/test';

test('Feeds page should have a list of tags in the sidebar', async({feedsPage}) =>{
    await expect(feedsPage.popularTagListLocator).toBeVisible();
});

test.describe('mock data for the tags API', () =>{    
    const mockTags = ["RSS", "Atom", "Podcast", "Newsletter", "Syndication Feed", "Web Feed", 
        "XML", "JSON Feed", "RSS Reader", "Feed Aggregator", "Feedly", "Inoreader", "NewsBlur", 
        "The Old Reader", "Feedbin", "Tiny Tiny RSS", "Flipboard", "Pocket", "Instapaper", 
        "Feed Wrangler", "BazQux Reader", "CommaFeed"];
    
    test.beforeEach(async ({page})=>{  
        page.route(`${process.env.API_BASE_URL}/api/tags`, route =>{
            const tags= {
                "tags": mockTags
            };
            route.fulfill({body: JSON.stringify(tags)});
        });
    })

    test('should display all tags from the API', async({feedsPage}) =>{
        await expect(feedsPage.popularTagListLocator).toHaveText(mockTags.join(' '));
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

    test('should display the custom tag from the API', async({feedsPage})=>{
        await expect(feedsPage.popularTagListLocator).toContainText('Custom tag bla bla');
    })
});