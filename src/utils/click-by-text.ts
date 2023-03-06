const escapeXpathString = (str: string): string => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
};

export default async function clickByText(page, tag: string, text: string) {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//${tag}[contains(text(), ${escapedText})]`);

    if (linkHandlers.length > 0) {
        await linkHandlers[0].click();
    } else {
        throw new Error(`Link not found: ${text}`);
    }
};