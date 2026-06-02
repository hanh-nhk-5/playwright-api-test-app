import {Page} from '@playwright/test';
import { SignInPage } from './sign-in.page';
import { NavigationPage } from './navigation.page';
import { FeedsPage } from './feeds.page';
import { ArticleDetailsPage } from './article-details.page';
import { ArticleEditorPage } from './article-editor.page';
import { SignUpPage } from './sign-up.page';

export class PageManager{
    navigationPage: NavigationPage;
    signUpPage: SignUpPage;
    signInPage: SignInPage;
    feedsPage: FeedsPage;
    newArticlePage: ArticleEditorPage;
    articleDetailsPage: ArticleDetailsPage;
    constructor(public page: Page){
        this.navigationPage= new NavigationPage(this.page);
        this.signUpPage= new SignUpPage(this.page);
        this.signInPage= new SignInPage(this.page);
        this.feedsPage= new FeedsPage(this.page);
        this.newArticlePage= new ArticleEditorPage(this.page);
        this.articleDetailsPage= new ArticleDetailsPage(this.page);
    }

    navigate(){
        return this.navigationPage
    }

    onSignUpPage(){
        return this.signUpPage;
    }

    onSignInPage(){
        return this.signInPage;
    }

    onFeedsPage(){
        return this.feedsPage;
    }

    onNewArticlePage(){
        return this.newArticlePage;
    }
    onArticleDetailsPage(){
        return this.articleDetailsPage;
    }
}