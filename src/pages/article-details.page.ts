import {Locator, Page} from '@playwright/test';
import { ArticleEditorPage } from './article-editor.page';
export class ArticleDetailsPage{
    titleLocator: Locator;
    bodyLocator: Locator;
    tagListLocator: Locator;

    constructor(public page: Page){
        this.titleLocator = page.locator('.banner h1');
        this.bodyLocator = page.locator('.article-content p');
        this.tagListLocator = page.locator('.tag-list');
    }

    async matchTags(expectedTags: string[]): Promise<boolean>{
        expectedTags = expectedTags.map(tag => tag.trim().toUpperCase());
        const tags = (await this.tagListLocator.locator('.tag-pill').allTextContents()).map(tag => tag.trim().toUpperCase());        
        return expectedTags.every(tag => tags.includes(tag));
    }

    async openArticleEditor(): Promise<ArticleEditorPage>{
        // await this.page.waitForSelector('a:has-text("Edit Article")', { timeout: 5000 });
        await this.page.locator('.banner app-article-meta a', { hasText: 'Edit Article' }).click();        
        return new ArticleEditorPage(this.page);
    }

    async getTitle(): Promise<string|null> {
        return await this.titleLocator.textContent();
    }

    async deleteArticle(){
        await this.page.locator('.banner app-article-meta button', { hasText: 'Delete Article' }).click();
    }
}