import {Page, Locator, APIRequestContext} from '@playwright/test';
import { ArticleDetailsPage } from './article-details.page';

export class FeedsPage{
    readonly articlesPerPage = 10;
    tagListLocator: Locator;
    globalFeedTabLocator: Locator;
    paginationLocator: Locator;
    constructor(public page: Page){
        this.tagListLocator= this.page.locator('.sidebar .tag-list');
        this.globalFeedTabLocator= this.page.locator('a.nav-link', {hasText: 'Global Feed'});
        this.paginationLocator= this.page.locator('.pagination');
    }

    async getNumberOfPages(): Promise<number>{        
        return await this.paginationLocator.locator('li.page-item').count();
    }

    async clickPagination(pageNumber: number){
        const pageLinkLocator = this.paginationLocator.locator('.page-link', {hasText: new RegExp(`^\\s*${pageNumber}\\s*$`)});
        await pageLinkLocator.click();
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
        title = title.trim();
        const articleTitleLocator = this.page.locator('a.preview-link h1', {hasText: new RegExp(`^\\s*${title}\\s*$`)});
        return await articleTitleLocator.count() > 0;
    }        

    async getFavoriteLocatorWithTitle(title: string): Promise<Locator>{
        const articleTitleLocator = this.page.locator('.article-preview')
            .filter({has: this.page.locator('a.preview-link h1', {hasText: new RegExp(`^\\s*${title}\\s*$`)})})
            .locator('button.btn.btn-sm'); 
        return articleTitleLocator;
    }
}