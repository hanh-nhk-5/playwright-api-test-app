import {Page, Locator} from '@playwright/test';
import { Article } from '../types/article';

export class ArticleEditorPage{
    titleInput: Locator;
    descriptionInput: Locator;
    bodyInput: Locator;
    tagsInput: Locator;
    tagDeleleButtons: Locator;
    publishButton: Locator;

    constructor(public page: Page, slug?: string){
        this.titleInput= page.locator('input[formcontrolname="title"]');
        this.descriptionInput= page.locator('input[formcontrolname="description"]');
        this.bodyInput= page.locator('textarea[formcontrolname="body"]');
        this.tagsInput= page.locator('input[placeholder="Enter tags"]');
        this.tagDeleleButtons= page.locator('.tag-list .tag-pill .ion-close-round');
        this.publishButton= page.getByRole('button', {name: /Publish Article/});    
    }

    async publishArticle(article: Article){
        await this.titleInput.fill(article.title);
        await this.descriptionInput.fill(article.description);
        await this.bodyInput.fill(article.body);        
        await this.fillTags(article.tagList);
        await this.publishButton.click();
    }

    private async fillTags(tags: string[]){
        
        while(await this.tagDeleleButtons.count() > 0){
            const button =  this.tagDeleleButtons.first();
            await button.waitFor({state: 'visible'});
            await button.click();
        }

        for(const tag of tags){
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }   
    }
 }