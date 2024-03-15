import * as htmlParser from 'node-html-parser';

const TAG = 'dl';
const TAG_OPEN = `<${TAG}>`;
const TAG_CLOSE = `</${TAG}>`;

type Range = {
  start: number;
  end: number;
};

// TODO
// - find out the tag from looking at the string?
export const getHeaderRange = (htmlString: string, name: string): Range => {
  const headerRegex = new RegExp(`>${name}</h[1-6]>`);

  const standardized = htmlString.toLowerCase();
  const startIdx = standardized.search(headerRegex);

  if (startIdx === -1) throw new Error('Header was not found');

  const openedTags = [];
  const closedTags = [];
  let currentIdx = startIdx;

  while (true) {
    if (currentIdx > standardized.length - TAG_CLOSE.length) {
      // reached the end without break condition
      throw new Error(`Parent tag '${TAG}' was not opened or closed`);
    }

    if (standardized.at(currentIdx) === '<') {
      const substring = standardized.substring(currentIdx, currentIdx + TAG_CLOSE.length);

      if (substring.startsWith(TAG_OPEN)) openedTags.push(currentIdx);
      else if (substring.startsWith(TAG_CLOSE)) closedTags.push(currentIdx);

      // break if parent tag has been opened and closed
      if (openedTags.length > 0 && openedTags.length === closedTags.length) break;
    }

    currentIdx++;
  }

  return {
    start: openedTags[0],
    end: closedTags[closedTags.length - 1] + TAG_CLOSE.length,
  };
};

export const getHtmlBlock = (htmlString: string, { start, end }: Range): htmlParser.HTMLElement => {
  return htmlParser.parse(htmlString.substring(start, end));
};

export const getLinksFromHtmlBlock = (htmlBlock: htmlParser.HTMLElement) => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map(link => ({
    title: link.textContent,
    href: link.getAttribute('href'),
  }));
};
