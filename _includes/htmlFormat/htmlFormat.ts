import stripComments from "./stripComments.ts";
import { traverse } from './traverse.ts';

export default (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            const document = page.document!;
            traverse(document.childNodes, stripComments);
        }
    );
};
