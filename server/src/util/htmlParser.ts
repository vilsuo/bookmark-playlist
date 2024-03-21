import * as htmlParser from 'node-html-parser';
import { CategoryLink, RawLink } from '../types';

const HEADER_END = /^<\/h[1-6]>/g;

const TAG = 'dl';
const TAG_OPEN = `<${TAG}>`;
const TAG_CLOSE = `</${TAG}>`;

/**
 * Find the header text by back tracking from header ending tag.
 * 
 * Given html string '<h1>Test<h1>' and starting index 8, 
 * returns { index: 4, header: 'Test' }.
 *
 * @param htmlString
 * @param start index of the header ending tag '<' character
 * @returns
 */
const getHeaderText = (htmlString: string, start: number) => {
  for (let i = start; i >= 0; i--) {
    if (htmlString.at(i) === '>') {
      return {
        index: i,
        header: htmlString.substring(i + 1, start),
      };
    }
  }
  throw new Error('Sub folder header text was not found');
};


/**
 * The html string is expected to constructed as given by the
 * Backus-Naur Form (BNF):
 * 
 * <root> 		  ::= "<body>" <header> <dl> "</body>"
 * <dl> 		    ::= "<dl>" (<dtfolder> | <dtsingle>)+ "</dl>"
 * <dtfolder> 	::= "<dt>" <header> <dl> "</dt>"
 * <dtsingle> 	::= "<dt>" <link> "</dt>"
 * <header> 	  ::= "<h" <step> (" " <attribute>)*  ">" <text> "</" <step> "h>"
 * <link> 		  ::= "<a (" " <attribute>)* ">" <text> "</a>"
 * <step>       ::= [1-6]
 * 
 * ... something like that
 * 
 * Important
 * - each folder is expected to be linked to a dl tag opening and closing
 * - dl tags can not contain any atttibutes
 * - the links inside a dl tag is expected to belong to the closes preceding header
 * - header text should not contain the character '>'
 *
 * @param htmlString a syntatically valid html string
 * @param header the header text where to start searching
 * @returns Object containing the arrays:
 *    opened: indexes of opened dl tags
 *    closed: indexes of closed dl tags
 *    headers: indexes and texts of the headers
 */
const getHeaderRange = (htmlString: string, header: string) => {
  // important to contain opening '>' so the header can be found
  const startHeaderRegex = new RegExp(
    `>\\s*${header.toLowerCase()}\\s*</h[1-6]>`,
  );

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
      const substring = standardized.substring(currentIdx, currentIdx + 5);

      if (substring.startsWith(TAG_OPEN)) {
        // save start of start tag
        openedTags.push(currentIdx);
      } else if (substring.startsWith(TAG_CLOSE)) {
        // save end of end tag
        closedTags.push(currentIdx + TAG_CLOSE.length);
      } else if (HEADER_END.test(substring)) {
        // start of a new folder
        headers.push(getHeaderText(htmlString, currentIdx));
      }

      // break if a tag has been opened and all tags are closed
      if (openedTags.length > 0 && openedTags.length === closedTags.length) {
        break;
      }
    }

    currentIdx++;
  }

  console.log('Headers', headers);

  return {
    opened: openedTags,
    closed: closedTags,
    headers,
  };
};

type Range = {
  start: number;
  end: number;
};

const getHtmlBlock = (
  htmlString: string,
  { start, end }: Range,
): htmlParser.HTMLElement => {
  return htmlParser.parse(htmlString.substring(start, end));
};

const getLinksFromHtmlBlock = (
  htmlBlock: htmlParser.HTMLElement,
): RawLink[] => {
  const links = htmlBlock.querySelectorAll('a');

  return links.map((link) => ({
    title: link.textContent,
    href: link.getAttribute('href'),
    addDate: link.getAttribute('add_date'),
  }));
};

/**
 * Searches for HTML link elements based on a header. Search is limited to
 * inside the header elements next sibling 'dl' element. Header is case insensitive.
 * 
 * See {@link getHeaderRange} and {@link getLinksFromHtmlBlock}
 *
 * @param htmlString
 * @param header
 * @returns Array of link element text and href attributes
 */
export const getHeaderNextDlSiblingLinks = (
  htmlString: string,
  header: string,
): CategoryLink[] => {
  // use map to override category names
  const map = new Map<string, CategoryLink>();

  // Initially just find the folder names. Include also the 'main' header
  const { headers } = getHeaderRange(htmlString, header);

  // calculate for each folder name, nested folders are calculted
  // multiple times, each time overriding the link category
  for (const { index, header } of headers) {
    const substring = htmlString.substring(index);

    const { opened, closed } = getHeaderRange(substring, header);

    const range = {
      start: opened[0],
      end: closed[closed.length - 1],
    };

    const block = getHtmlBlock(substring, range);
    const rawLinks = getLinksFromHtmlBlock(block);

    for (const rawLink of rawLinks) {
      map.set(
        rawLink.title, // is link title a valid key?
        { ...rawLink, category: header },
      );
    }
  }

  return Array.from(map.values());
};
