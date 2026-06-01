import {Locator, Page} from '@playwright/test';
import { ArticleEditorPage } from './article-editor.page';
export class ArticleDetailsPage{
    title: Locator;
    body: Locator;
    tagList: Locator;
    constructor(public page: Page){
        this.title = page.locator('.banner h1');
        this.body = page.locator('.article-content p');
        this.tagList = page.locator('.tag-list');
    }

    async openArticleEditor(): Promise<ArticleEditorPage>{
        // await this.page.waitForSelector('a:has-text("Edit Article")', { timeout: 5000 });
        await this.page.locator('.banner app-article-meta a', { hasText: 'Edit Article' }).click();        
        return new ArticleEditorPage(this.page);
    }
}