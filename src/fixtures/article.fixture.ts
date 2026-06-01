import { ArticleEditorPage } from '../pages/article-editor.page';
import{test as base} from './page-manager.fixture';

export const test= base.extend<{ newArticlePage: ArticleEditorPage }>({
    newArticlePage: async ({pageManager}, use) =>{
        await pageManager.navigate().gotoNewArticlePage();
        const newArticlePage= pageManager.onNewArticlePage();        
        await use(newArticlePage);        
    }
});