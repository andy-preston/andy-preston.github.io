module.exports = (content: string): string => {
    return content.replace(/\s+/g, ' ').replace(/\/\*[^*]*\*\//g, '').replace(/\s+/g, ' ').trim();
}
