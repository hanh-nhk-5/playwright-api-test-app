import {Page, Locator, APIRequestContext} from '@playwright/test';
import { ArticleDetailsPage } from './article-details.page';

export class FeedsPage{
    tagListLocator: Locator;
    globalFeedTabLocator: Locator;
    constructor(public page: Page){
        this.tagListLocator= this.page.locator('.sidebar .tag-list');
        this.globalFeedTabLocator= this.page.locator('a.nav-link', {hasText: 'Global Feed'});
    }

    async openGlobalFeed(){
        await this.globalFeedTabLocator.click();
    }

    async viewArticleBySlug(slug: string): Promise<ArticleDetailsPage>{
        const title = this.extractTitleFromSlug(slug);
        const articleLinkLocator= this.page.locator('a.preview-link h1', {hasText: title});

        const [response] = await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('/api/articles') &&                
                response.request().method() === 'GET' &&
                response.ok()
            ),
            articleLinkLocator.click()
        ]).catch(error => {
            console.error(`Failed to view article with title "${title}": ${error}`);
            throw error;
        });       
        
        return new ArticleDetailsPage(this.page);
    }

    extractTitleFromSlug(slug: string): string {
        const parts = slug.split('-');
        if (parts.length < 2) {
            throw new Error(`Invalid slug format: ${slug}`);
        }
        return parts.slice(0, -1).join(' ');
    }

    async isThereArticleWithTitle(title: string): Promise<boolean>{
        const articleLinkLocator = this.page.locator('a.preview-link h1', {hasText: title});
        return await articleLinkLocator.count() > 0;
    }        
}