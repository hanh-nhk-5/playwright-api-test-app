import {Page, Locator} from '@playwright/test';
import { ArticleDetailsPage } from './article-details.page';
import { Article } from '../types/article';
import { areArraysEqual } from '../utils/array.util';

export class FeedsPage{
    readonly articlesPerPage = 10;
    popularTagListLocator: Locator;    
    globalFeedTabLocator: Locator;
    paginationLocator: Locator;
    articleCards: Locator;
    constructor(public page: Page){
        this.popularTagListLocator= this.page.locator('.sidebar .tag-list');        
        this.globalFeedTabLocator= this.page.locator('a.nav-link', {hasText: 'Global Feed'});
        this.paginationLocator= this.page.locator('.pagination');
        this.articleCards = this.page.locator('app-article-preview');
    }

    async isGlobalFeedTabActive(): Promise<boolean>{
        const classAttribute = await this.globalFeedTabLocator.getAttribute('class');
        return classAttribute?.split(' ').includes('active') ?? false;
    }

    async reloadGlobalFeedTag(){
        if(await this.isGlobalFeedTabActive())
            await this.page.reload(); // reload to ensure global feed is loaded and tags are displayed 
        else 
            await this.openGlobalFeed();
    }

    async allArticlesHaveTag(tagName: string): Promise<boolean>{
        const articleCount = await this.page.locator('.article-preview').count();
        for(let i=0 ; i < articleCount; i++){
            const article = this.page.locator('.article-preview').nth(i);
            const tags = (await article.locator('.tag-list .tag-pill').allTextContents()).map(tag => tag.trim());            
            if(tags.length === 0 || !tags.includes(tagName)){
                return false;
            }
        }
        return true;
    }

    async clickTag(tagName: string){
        const tagLocator = this.popularTagListLocator.locator('a.tag-pill', {hasText: new RegExp(`^\\s*${tagName}\\s*$`)});
        await tagLocator.click();
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
    
    async display(article: Article): Promise<boolean>{        
        const articleCard = this.articleCards.filter({has: this.page.locator('a.preview-link h1', {hasText: new RegExp(`^\\s*${article.title}\\s*$`)})});
        if(await articleCard.count() === 0){
            console.warn(`Article with title "${article.title}" not found in the feed.`);
            return false;
        }

        const actualDescription = (await articleCard.locator('p').first().textContent())?.trim().toUpperCase() ?? '';        
        const actualTags = (await articleCard.locator('.tag-list .tag-pill').allTextContents()).map(tag => tag.trim().toUpperCase());
        article.description = article.description.trim().toUpperCase()
        article.tagList = article.tagList.map(tag => tag.trim().toUpperCase());
        if(actualDescription !== article.description || !areArraysEqual(actualTags, article.tagList)){
            return false;
        }
 
        return true;    
    }

    async getFavoriteLocatorWithTitle(title: string): Promise<Locator>{
        const articleTitleLocator = this.page.locator('.article-preview')
            .filter({has: this.page.locator('a.preview-link h1', {hasText: new RegExp(`^\\s*${title}\\s*$`)})})
            .locator('button.btn.btn-sm'); 
        return articleTitleLocator;
    }
}