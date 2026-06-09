import { expect } from '@playwright/test';
import {test} from '../../src/fixtures/article-edit.fixture';
import { ArticleDetailsPage } from '../../src/pages/article-details.page';
import { Article } from '../../src/types/article';

test('should edit an existing article successfully', async({editArticlePage}) =>{
    //Wait for the title input to be populated with the existing article title before proceeding with edits
    await expect(editArticlePage.titleInput).not.toHaveValue('', { timeout: 10000 });

    const article: Article = {
        title: `Hanh's updated article ${Date.now()}`,
        description: 'update description',
        body: 'update body',
        tagList: ['new tag']    
    }
 
    await editArticlePage.publishArticle(article);
    
    const articleDetailsPage = new ArticleDetailsPage(editArticlePage.page);    
    await articleDetailsPage.titleLocator.waitFor({ state: 'visible', timeout: 10000 });
    const actualTitle = await articleDetailsPage.titleLocator.textContent();
    const actualBody = await articleDetailsPage.bodyLocator.textContent();        

    expect(actualTitle?.trim()).toBe(article.title);
    expect(actualBody?.trim()).toBe(article.body);
    expect(articleDetailsPage.matchTags(article.tagList)).toBeTruthy();
    
    
})