import {Page, Locator} from '@playwright/test';
 export class ArticleEditorPage{
    titleInput: Locator;
    descriptionInput: Locator;
    bodyInput: Locator;
    tagsInput: Locator;
    tagDeleleButtons: Locator;
    publishButton: Locator;

    // slug: string | undefined;
    constructor(public page: Page, slug?: string){
        this.titleInput= page.locator('input[formcontrolname="title"]');
        this.descriptionInput= page.locator('input[formcontrolname="description"]');
        this.bodyInput= page.locator('textarea[formcontrolname="body"]');
        this.tagsInput= page.locator('input[placeholder="Enter tags"]');
        this.tagDeleleButtons= page.locator('.tag-list .tag-pill .ion-close-round');
        this.publishButton= page.getByRole('button', {name: /Publish Article/});
        // this.slug = slug;
    }

    async publishArticle(title: string, description: string, body: string, tags: string[]){
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyInput.fill(body);
        await this.tagsInput.fill('');
        await this.fillTags(tags);
        await this.publishButton.click();
    }

    private async fillTags(tags: string[]){
        (await this.tagDeleleButtons.all()).forEach(button => button.click());

        for(const tag of tags){
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }   
    }
 }