import {Locator, Page} from '@playwright/test';
export class ArticleDetailsPage{
    title: Locator;
    constructor(public page: Page){
        this.title = page.locator('.banner h1');
    }
}