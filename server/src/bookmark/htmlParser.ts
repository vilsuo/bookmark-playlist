import { parse as parseHtml, HTMLElement } from 'node-html-parser';
import { FolderLink, Link } from '../types';

const HEADER_END = /^<\/h[1-6]>/g;

const TAG = 'dl';
const TAG_OPEN = `<${TAG}>`;
const TAG_CLOSE = `</${TAG}>`;

type HeaderTextContentInfo = {
  startingIndex: number;  // header text content start index
  textContent: string;    // header text content
};

/**
 * Get the header text content by back tracking from header ending tag.
 *
 * Given html string '<h1>Test<h1>' and starting index 8,
 * returns { index: 4, header: 'Test' }.
 *
 * @param html
 * @param index starting index of the header ending tag ('<' character)
 * @returns
 */
const getHeaderTextContentInfo = (html: string, index: number): HeaderTextContentInfo => {
  for (let i = index; i >= 0; i--) {
    if (html.at(i) === '>') {
      const textContent = html.substring(i + 1, index);
      return { startingIndex: i, textContent };
    }
  }
  throw new Error('Header was not found');
};

type FolderStructure = {
  openedIndexes: number[];  // starting indexes of TAG_OPEN
  closedIndexes: number[]; // ending indexes of TAG_CLOSE
  headerInfoes: HeaderTextContentInfo[]; // 
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
 * - each folder is expected to be linked to the next {@link TAG} block
 * - the element {@link TAG} can not contain any attributes
 * - the link elements contained inside of a {@link TAG} block are expected
 *   to belong to the closest preceding header
 * - header text content should not contain the character '>'
 *
 * @param html a syntatically valid html string
 * @param header the case insensitive header text content. Searching starts
 *   from here and ends after the first {@link TAG} element block
 * @returns Object containing the arrays:
 *    'opened':   the starting indexes of opened {@link TAG}.
 *    'closed':   the ending indexes of closed {@link TAG}.
 *    'headers':  the starting indexes of header text contents and the
 *                corresponding text contents
 */
const getFolderStructure = (html: string, header: string): FolderStructure => {
  const searchString = html.toLowerCase();

  // important to contain opening '>' so the header can be found
  const startRegex = new RegExp(`>\\s*${header.toLowerCase()}\\s*</h[1-6]>`);
  const startIdx = searchString.search(startRegex);

  if (startIdx === -1) throw new Error(`Header '${header}' was not found`);

  const headerInfoes = [];
  const openedTags = [];
  const closedTags = [];
  let currentIdx = startIdx;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (currentIdx > searchString.length - 5) {
      // reached the end without break condition
      throw new Error(`Parent tag '${TAG}' was not opened or closed`);
    }

    if (searchString.at(currentIdx) === '<') {
      // take the html element
      const substring = searchString.substring(currentIdx, currentIdx + 5);

      if (substring.startsWith(TAG_OPEN)) {
        // save start of start tag
        openedTags.push(currentIdx);

      } else if (substring.startsWith(TAG_CLOSE)) {
        // save end of end tag
        closedTags.push(currentIdx + TAG_CLOSE.length);

      } else if (HEADER_END.test(substring)) {
        // start of a new folder
        headerInfoes.push(getHeaderTextContentInfo(html, currentIdx));
      }

      // break if a tag has been opened and all tags are closed
      if (openedTags.length > 0 && openedTags.length === closedTags.length) {
        break;
      }
    }

    currentIdx++;
  }

  return {
    openedIndexes: openedTags,
    closedIndexes: closedTags,
    headerInfoes,
  };
};

const getHtmlBlock = (html: string, start: number, end: number): HTMLElement =>
  parseHtml(html.substring(start, end));

const getLinksFromHtmlBlock = (htmlBlock: HTMLElement): Link[] => {
  const linkElements = htmlBlock.querySelectorAll('a');

  return linkElements.map((link) => ({
    text: link.textContent,
    href: link.getAttribute('href'),
    addDate: link.getAttribute('add_date'),
  }));
};

/**
 * Searches for HTML link elements based on a header. Search is limited to
 * inside the header elements next sibling 'dl' element. Header is case insensitive.
 *
 * See {@link getFolderStructure} and {@link getLinksFromHtmlBlock}
 *
 * @param html
 * @param header
 * @returns Array of link element text and href attributes
 */
export const createFolderLinks = (html: string, header: string): FolderLink[] => {
  // use map to override category names
  const map = new Map<string, FolderLink>();

  // Initially just find the folder names. Include also the 'main' header
  const { headerInfoes } = getFolderStructure(html, header);

  // nested folders are calculted multiple times, each time overriding the link category
  for (const { startingIndex, textContent } of headerInfoes) {
    const searchString = html.substring(startingIndex);

    const { openedIndexes, closedIndexes } = getFolderStructure(searchString, textContent);

    const blockStart = openedIndexes[0];
    const blockEnd = closedIndexes[closedIndexes.length - 1];
    const block = getHtmlBlock(searchString, blockStart, blockEnd);

    const links = getLinksFromHtmlBlock(block);

    // give the folder for each link
    for (const link of links) {
      map.set(
        link.text, // is link text a valid key?
        { ...link, folder: textContent }, 
      );
    }
  }

  return Array.from(map.values());
};
