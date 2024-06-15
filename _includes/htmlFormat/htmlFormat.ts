import { traverse } from './traverse.ts';

const dummyCallback = (child: Node) => {
}

export default (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            const document = page.document!;
            traverse(document.childNodes, dummyCallback);
        }
    );
};
