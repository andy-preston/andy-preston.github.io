import stripComments from "./stripComments.ts";
import stripWhitespace from "./stripWhitespace.ts";
import traverseDocument from './traverse.ts';

export default (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            const document = page.document!;
            traverseDocument(document, stripComments);
            traverseDocument(document, stripWhitespace);
        }
    );
};
