import * as htmlParser from 'node-html-parser';
import { RawLink } from '../types';

//const HEADER_REGEX = />\s*(\w+)\s*<\/h[1-6]>/g;

/*
const getHeaders = (htmlString: string) => {
  const headerRegex = />\s*(\w+)\s*<\/h[1-6]>/g;
  return htmlString.matchAll(headerRegex);
};
*/

const HEADER_END = /^<\/h[1-6]>/g;

const TAG = 'dl';
const TAG_OPEN = `<${TAG}>`;
const TAG_CLOSE = `</${TAG}>`;

type Range = {
  start: number;
  end: number;
};


/**
 * Find the header text by back tracking
 * 
 * @param htmlString 
 * @param start index of the header ending tags start character
 * @returns 
 */
const getHeaderText = (htmlString: string, start: number) => {
  for (let i = start; i >= 0; i--) {
    if (htmlString.at(i) === '>') {
      return htmlString.substring(i + 1, start);
    }
  }
  throw new Error('Sub folder header text was not found');
};

/**
 * Find the substring of the html string which corresponds to folder of
 * given header
 * 
 * Case insensitive match for header
 * 
 * @param htmlString 
 * @param header
 * @returns 
 */
const getHeaderRange = (htmlString: string, header: string): Range => {

  // important to contain opening '>' so the header can be found
  const startHeaderRegex = new RegExp(`>\\s*${header.toLowerCase()}\\s*</h[1-6]>`);

  const standardized = htmlString.toLowerCase();
  const startIdx = standardized.search(startHeaderRegex);

  if (startIdx === -1) throw new Error(`Header '${header}' was not found`);

  const headers = [];
  const openedTags = [];
  const closedTags = [];
  let currentIdx = startIdx;

  while (true) {
    if (currentIdx > standardized.length - 5) {
      // reached the end without break condition
      throw new Error(`Parent tag '${TAG}' was not opened or closed`);
    }

    if (standardized.at(currentIdx) === '<') {
      // take the html element
      const substring = standardized.substring(
        currentIdx,
        currentIdx + 5,
      );

      if (substring.startsWith(TAG_OPEN)) {
        openedTags.push(currentIdx);

      } else if (substring.startsWith(TAG_CLOSE)) {
        closedTags.push(currentIdx);

      } else if (HEADER_END.test(substring)) {
        // start of a new folder
        headers.push({
          index: currentIdx, // ...
          text: getHeaderText(htmlString, currentIdx),
        });
      }

      // break if parent tag has been opened and closed
      if (openedTags.length > 0 && openedTags.length === closedTags.length) {
        break;
      }
    }

    currentIdx++;
  }

  console.log('Headers', headers);

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

const getLinksFromHtmlBlock = (
  htmlBlock: htmlParser.HTMLElement,
  header: string,
): RawLink[] => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map((link) => ({
    title: link.textContent,
    href: link.getAttribute('href'),
    addDate: link.getAttribute('add_date'),
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
 *      <a href="link0" add_date="1708428547">A</a>
 *      <h3>Header 1</h3>
 *      <a href="link1" add_date="1708428548">B</a>
 *      <dl>
 *        <a href="link2" add_date="1708428549">C</a>
 *      </dl>
 *      <dl>
 *        <a href="link3" add_date="1708428550">D</a>
 *      </dl>
 *      <h3>Header 2</h3>
 *      <dl>
 *        <a href="link4" add_date="1708428551">E</a>
 *      </dl>
 *   </dl>
 * </body>,
 *
 * then only the link { title: 'C', href: link2 } is returned.
 *
 * @param htmlString
 * @param header
 * @returns Array of link element text and href attributes
 */
export const getHeaderNextDlSiblingLinks = (
  htmlString: string,
  header: string,
): RawLink[] => {
  const range = getHeaderRange(htmlString, header);
  const block = getHtmlBlock(htmlString, range);
  const links = getLinksFromHtmlBlock(block, header);

  return links;
};
