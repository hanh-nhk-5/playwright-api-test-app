import {Page, Locator} from '@playwright/test';
 export class NewArticlePage{
    titleInput: Locator;
    descriptionInput: Locator;
    bodyInput: Locator;
    tagsInput: Locator;
    publishButton: Locator;
    constructor(public page: Page){
        this.titleInput= page.locator('input[formcontrolname="title"]');
        this.descriptionInput= page.locator('input[formcontrolname="description"]');
        this.bodyInput= page.locator('textarea[formcontrolname="body"]');
        this.tagsInput= page.locator('input[placeholder="Enter tags"]');
        this.publishButton= page.getByRole('button', {name: /Publish Article/i});
    }

    async createArticle(title: string, description: string, body: string, tags: string[]){
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyInput.fill(body);
        for(const tag of tags){
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }
        await this.publishButton.click();
    }
 }