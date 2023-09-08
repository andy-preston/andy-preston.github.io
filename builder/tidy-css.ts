module.exports = (content: string): string => {
    // Rubbish quick stand in for a proper css cleaner
    return content.replace(/\s+/g, ' ').replace(/\/\*[^*]*\*\//g, '').replace(/\s+/g, ' ').trim();
}
