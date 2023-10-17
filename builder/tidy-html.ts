import { parseDocument } from "htmlparser2";
import render from "dom-serializer";
import { Node, isDirective, isTag, isText, hasChildren } from "domhandler";
import { removeElement } from "domutils";

const upperCaseDocType = (node: Node): void => {
    if (isDirective(node) && node.name == "!doctype") {
        node.data = "!DOCTYPE HTML";
    }
}

const stripLeadingSlashes = (node: Node): void => {
    if (isTag(node)) {
        Object.keys(node.attribs).forEach(
            (attribute: string) => {
                if (['href', 'src'].includes(attribute)) {
                    const value = node.attribs[attribute];
                    if (value && value[0] == '/') {
                        node.attribs[attribute] = value.slice(1);
                    }
                }
            }
        );
    }
}

const hasPreParent = (node: Node): boolean => {
    if (isTag(node) && node.name == 'pre') {
        return true;
    }
    const parent = node.parent;
    return parent === null ? false : hasPreParent(parent);
}

const isNotInline = (node: Node|null): boolean => {
    return node === null || !isTag(node) || ![
        "a",
        "code",
        "em",
        "span",
        "strong"
    ].includes(node.name);
}

const stripUnusedJs = (node: Node): void => {
    if (isTag(node) && node.name == "script" && node.attribs.src == '') {
        removeElement(node);
    }
}

const stripWhitespace = (node: Node): void => {
    if (isText(node) && !hasPreParent(node)) {
        node.data = node.data.replace(/\s+/g, ' ');
        if (isNotInline(node.next)) {
            node.data = node.data.trimEnd();
        }
        if (isNotInline(node.prev)) {
            node.data = node.data.trimStart();
        }
    }
}

type TraversalCallback = (child: Node) => void;

const traverse = (children: Node[], callback: TraversalCallback): void => {
    children.forEach((child: Node): void => {
        callback(child);
        if (hasChildren(child)) {
            traverse(child.children, callback);
        }
    });
}

export = (content: string): string => {
    const dom = parseDocument(content);
    traverse(dom.children, (child: Node): void => {
        upperCaseDocType(child);
        stripLeadingSlashes(child);
        stripUnusedJs(child);
    });
    /* We traverse twice because stripping out empty `<script>` tags can
       leave whitespace "laying around". It'd be worth investigating a more
       efficient way around this */
    traverse(dom.children, (child: Node): void => {
        stripWhitespace(child);
    });
    return render(dom);
}
