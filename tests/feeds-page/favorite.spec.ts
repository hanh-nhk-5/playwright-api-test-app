import {test} from '../../src/fixtures/feeds-favorite.fixture';
import { expect } from '@playwright/test';

test('User can favorite and remove the favorite from an article in the global feed and see its counter increase', async ({feedsPage, sampleArticleTitle, sampleTag}) => {    
    await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/api/tags') &&
            response.request().method() === 'GET' &&
            response.ok()
        ),
        feedsPage.reloadGlobalFeedTab()
    ]);

    await expect.poll(async () => await feedsPage.getTagLocator(sampleTag).count()).toBeGreaterThan(0); // ensure the favorite tag is visible in the sidebar

    await feedsPage.clickTag(sampleTag);//click on the favorite tag to filter articles by that tag and ensure the test article is visible in the feed

    const favoriteButton = await feedsPage.getFavoriteLocatorWithTitle(sampleArticleTitle);
    await expect(favoriteButton).toHaveCount(1);

    const beforeFavorite = Number((await favoriteButton.textContent())?.trim() ?? '0');

    // click favorite button and wait for the API response to ensure the action is completed before assertion
    await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/favorite') &&
            response.request().method() === 'POST' &&
            response.ok()
        ),
        favoriteButton.click()
    ]);

    await expect(favoriteButton).toHaveText(new RegExp(`^\\s*${beforeFavorite + 1}\\s*$`));

    // click favorite button again to remove from favorites and wait for the API response
    await Promise.all([
        feedsPage.page.waitForResponse(response =>
            response.url().includes('/favorite') &&
            response.request().method() === 'DELETE' &&
            response.ok()
        ),
        favoriteButton.click()
    ]);
    await expect(favoriteButton).toHaveText(new RegExp(`^\\s*${beforeFavorite}\\s*$`));
});