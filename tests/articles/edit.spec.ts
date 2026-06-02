import { expect } from '@playwright/test';
import {test} from '../../src/fixtures/edit-article.fixture';
import { ArticleDetailsPage } from '../../src/pages/article-details.page';

test('should edit an existing article successfully', async({editArticlePage}) =>{
    //Wait for the title input to be populated with the existing article title before proceeding with edits
    await expect(editArticlePage.titleInput).not.toHaveValue('', { timeout: 10000 });

    const updatedTitle = `Hanh's updated article ${Date.now()}`;    
    const updatedDescription = 'update description';
    const updatedBody = 'update body';
    const updatedTags = ['new tag'];    
    await editArticlePage.publishArticle(updatedTitle, updatedDescription, updatedBody, updatedTags);    
    
    const articleDetailsPage = new ArticleDetailsPage(editArticlePage.page);    
    await articleDetailsPage.title.waitFor({ state: 'visible', timeout: 10000 });
    const actualTitle = await articleDetailsPage.title.textContent();
    const actualBody = await articleDetailsPage.body.textContent();    
    const actualTags = await articleDetailsPage.tagList.locator('.tag-default').allTextContents()
        .then(tags => tags.map(tag => tag.trim())) ;

    expect(actualTitle?.trim()).toBe(updatedTitle);
    expect(actualBody?.trim()).toBe(updatedBody);
    for (const tag of updatedTags) {
        expect(actualTags).toContain(tag);
    }
    
    
})