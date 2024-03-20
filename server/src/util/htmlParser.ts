import * as htmlParser from 'node-html-parser';
import { Link } from '../types';

const TAG = 'dl';
const TAG_OPEN = `<${TAG}>`;
const TAG_CLOSE = `</${TAG}>`;

type Range = {
  start: number;
  end: number;
};

const getHeaderRange = (htmlString: string, header: string): Range => {
  const headerRegex = new RegExp(`>\\s*${header.toLowerCase()}\\s*</h[1-6]>`);

  const standardized = htmlString.toLowerCase();
  const startIdx = standardized.search(headerRegex);

  if (startIdx === -1) throw new Error(`Header '${header}' was not found`);

  const openedTags = [];
  const closedTags = [];
  let currentIdx = startIdx;

  while (true) {
    if (currentIdx > standardized.length - TAG_CLOSE.length) {
      // reached the end without break condition
      throw new Error(`Parent tag '${TAG}' was not opened or closed`);
    }

    if (standardized.at(currentIdx) === '<') {
      const substring = standardized.substring(
        currentIdx,
        currentIdx + TAG_CLOSE.length,
      );

      if (substring.startsWith(TAG_OPEN)) {
        openedTags.push(currentIdx);
      } else if (substring.startsWith(TAG_CLOSE)) {
        closedTags.push(currentIdx);
      }

      // break if parent tag has been opened and closed
      if (openedTags.length > 0 && openedTags.length === closedTags.length) {
        break;
      }
    }

    currentIdx++;
  }

  return {
    start: openedTags[0],
    end: closedTags[closedTags.length - 1] + TAG_CLOSE.length,
  };
};

const getHtmlBlock = (
  htmlString: string,
  { start, end }: Range,
): htmlParser.HTMLElement => {
  return htmlParser.parse(htmlString.substring(start, end));
};

const getLinksFromHtmlBlock = (htmlBlock: htmlParser.HTMLElement, header: string): Link[] => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map((link) => ({
    title: link.textContent,
    href: link.getAttribute('href'),
    category: header,
  }));
};

/**
 * Searches for HTML link elements based on a header. Search is limited to
 * inside the header elements next sibling 'dl' element. Header is case insensitive
 *
 * If given header 'Header 1' and the htmlString is:
 *
 * <body>
 *   <h1>Bookmarks<h1>
 *   <dl>
 *      <a></a>
 *      <h3>Header 1</h3>
 *      <a href="link1">A</a>
 *      <dl>
 *        <a href="link2">B</a>
 *      </dl>
 *      <dl>
 *        <a href="link3">C</a>
 *      </dl>
 *      <h3>Header 2</h3>
 *      <dl>
 *        <a href="link4">D</a>
 *      </dl>
 *   </dl>
 * </body>,
 *
 * then only the link { title: 'B', href: link2 } is returned.
 *
 * @param htmlString
 * @param header
 * @returns Array of link element text and href attributes
 */
export const getHeaderNextDlSiblingLinks = (
  htmlString: string,
  header: string,
): Link[] => {
  const range = getHeaderRange(htmlString, header);
  const block = getHtmlBlock(htmlString, range);
  const links = getLinksFromHtmlBlock(block, header);

  return links;
};
