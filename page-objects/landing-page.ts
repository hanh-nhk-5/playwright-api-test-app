import {Page, Locator} from '@playwright/test';

export class LandingPage{
    tagListLocator: Locator;
    constructor(public page: Page){
        this.tagListLocator= this.page.locator('.sidebar .tag-list');
    }
}