export default (document: Document, querySelector: string) => {
    const targets = document.querySelectorAll(querySelector);
    if (targets.length == 0) {
        return false;
    }

    for(const target of targets) {
        if (target.innerHTML.trim() == "") {
            target.remove();
            return true;
        }
    }

    return false;
};
