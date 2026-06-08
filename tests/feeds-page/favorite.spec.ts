import {test} from '../../src/fixtures/favorite.fixture';
import { expect } from '@playwright/test';

test('User can favorite an article from global feed and see its counter increase', async ({feedsPage, favoriteArticleTitle}) => {
    const favoriteButton = await feedsPage.getFavoriteLocatorWithTitle(favoriteArticleTitle);
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
});