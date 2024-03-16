import { getHeaderNextDlSiblingLinks } from '../../src/util/htmlParser';

/*

##########################
# Backus-Naur Form (BNF) #
##########################

Something like this...

<root> 		  ::= "<body>" <header> <dl> <paragraph> "</body>"
<dl> 		    ::= "<dl>" <paragraph> (<dtfolder> | <dtsingle>)+ "</dl>"
<dtfolder> 	::= "<dt>" <header> <dl> <paragraph> "</dt>"
<dtsingle> 	::= "<dt>" <link> "</dt>"
<header> 	  ::= "<h>" <text> "</h>"
<paragraph> ::= "<p>" <text> "</p>"
<link> 		  ::= "<a href=\"" <text> "\">" <text> "</a>"
<text> 		  ::= (<letter> | <digit> | <symbol>)*

these do not matter so much...

<letter>	  ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
<digit> 	  ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<symbol>	  ::= "|" | " " | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | "=" | "?" | "@" | "[" | "\"" | "]" | "^" | "_" | "`" | "{" | "}" | "~"

*/

type Attributes = Record<string, string>;

type HeaderType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type ElementType = 'a' | 'p' | HeaderType | 'dl' | 'dt' | 'body';

type HtmlElement = {
  tag: ElementType;
  attributes?: Attributes;
  content: string | HtmlElement | Array<HtmlElement>;
};

/**
 * <a href="somelink" { ...attributes }>{content}</a>
 */
type LinkElement = {
  tag: 'a';
  attributes: Attributes & { href: string };
  content: string;
};

/**
 * <p>{content}</p>
 */
type ParagraphElement = {
  tag: 'p';
  content: string;
};

/**
 * <h? { ...attributes }>{content}</h?>
 */
type HeaderElement = {
  tag: HeaderType;
  //attributes?: Attributes;
  content: string;
};

/**
 * <dt>
 *    <a />
 * </dt>
 */
type DtSingleElement = {
  tag: 'dt';
  content: LinkElement; // HtmlElement
};

/**
 * <dt>
 *    <h? />
 *    <dl />
 *    <p />
 * <dt>
 */
type DtFolderElement = {
  tag: 'dt';
  // one of each, in this order
  content: [HeaderElement, DlElement, ParagraphElement]; // Array<HtmlElement>;
};

/**
 * <dl>
 *    <p />
 *    <dt />
 *    <dt />
 *      .
 *      .
 *      .
 *    <dt />
 * </dl>
 */
type DlElement = {
  tag: 'dl';
  // exactly a single paragraph in the start
  // rest should be Dt:s
  content: [ParagraphElement, ...Array<DtSingleElement | DtFolderElement>]; // Array<HtmlElement>;
};

/**
 * <body>
 *    <h? />
 *    <dl />
 *    <p />
 * </body>
 */
type BodyElement = {
  tag: 'body';
  content: [HeaderElement, DlElement, ParagraphElement];
};

const isElement = (value: unknown): value is HtmlElement => {
  return value !== null && typeof value === 'object' && 'tag' in value;
};

const isElementArray = (value: unknown): value is Array<HtmlElement> => {
  return (
    Array.isArray(value) &&
    value.filter((c) => isElement(c)).length === value.length
  );
};

const parseAttributes = (attributes: Attributes) => {
  return Object.keys(attributes)
    .map((attr) => `${attr}="${attributes[attr]}"`)
    .join(' ');
};

const parseElement = (
  { tag, attributes, content }: HtmlElement,
  indent = 0,
) => {
  const attributeString = attributes ? ' ' + parseAttributes(attributes) : '';

  let children = '';
  if (typeof content === 'string') {
    children = content;
  } else if (isElement(content)) {
    children = parseElement(content, indent + 1);
  } else if (isElementArray(content)) {
    children = content.map((c) => parseElement(c, indent + 1)).join('');
  }

  return `
    ${'  '.repeat(indent)}<${tag}${attributeString}>
    ${'  '.repeat(indent + 1)}${children}
    ${'  '.repeat(indent)}</${tag}>
  `;
};

// CREATING

const createLinkElement = (href: string, text: string): LinkElement => ({
  tag: 'a',
  attributes: { href },
  content: text,
});

const createHeaderElement = (level: number, text: string): HeaderElement => {
  const headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  return {
    tag: headers[level - 1],
    content: text,
  };
};

const createParagraphElement = (text: string = ''): ParagraphElement => ({
  tag: 'p',
  content: text,
});

const createDtSingle = (linkElement: LinkElement): DtSingleElement => ({
  tag: 'dt',
  content: linkElement,
});

const createDtFolder = (
  level: number,
  headerText: string,
  dlElement: DlElement,
): DtFolderElement => ({
  tag: 'dt',
  content: [
    createHeaderElement(level, headerText),
    dlElement,
    createParagraphElement(),
  ],
});

const createDlElement = (
  dtElements: Array<DtFolderElement | DtSingleElement>,
): DlElement => ({
  tag: 'dl',
  content: [createParagraphElement(), ...dtElements],
});

const createBodyElement = (
  level: number,
  headerText: string,
  dlElement: DlElement,
): BodyElement => ({
  tag: 'body',
  content: [
    createHeaderElement(level, headerText),
    dlElement,
    createParagraphElement(),
  ],
});

// SAMPLE

const linkHrefTemplate = 'http://localhost:3000/some/addr/';
const linkTextTemplate = 'Link';

// create 10 single dts with links inside
const singles = [...Array(10).keys()].map((int) =>
  createDtSingle(
    createLinkElement(linkHrefTemplate + int, linkTextTemplate + int),
  ),
);

// create 3 dls for the folders
const dls = [
  createDlElement([singles[0]]),
  createDlElement([singles[2], singles[3]]),
  createDlElement([singles[5], singles[6], singles[7]]),
];

// create 3 folder dts
const folders = [
  createDtFolder(3, 'folder 1', dls[0]),
  createDtFolder(3, 'Folder 2', dls[1]),
  createDtFolder(3, 'folder 3', dls[2]),
];

const rootDl = createDlElement([
  folders[0],
  singles[1],
  folders[1],
  singles[4],
  folders[2],
  singles[8],
  singles[9],
]);

const body = createBodyElement(1, 'Bookmarks', rootDl);
const parsedBody = parseElement(body);

// console.log('body element', body);
// console.log('parsed', parsedBody);

describe('htmlParser', () => {
  describe('single link', () => {
    const header = 'folder 1';
    const links = getHeaderNextDlSiblingLinks(parsedBody, header);

    it('finds a single link', () => {
      expect(links).toHaveLength(1);
    });

    it('link href attribute is correct', () => {
      expect(links[0].href).toBe(linkHrefTemplate + 0);
    });

    it('link text content is correct', () => {
      expect(links[0].title.trim()).toBe(linkTextTemplate + 0);
    });
  });

  describe('two links', () => {
    const header = 'Folder 2';
    const links = getHeaderNextDlSiblingLinks(parsedBody, header);

    it('finds both links', () => {
      expect(links).toHaveLength(2);
    });
  });

  it('error is thrown when header is not found', () => {
    const missingHeader = 'This does not exist';

    expect(() =>
      getHeaderNextDlSiblingLinks(parsedBody, missingHeader),
    ).toThrow(Error);
  });

  it('error is thrown if parent dl tag is not closed', () => {
    const header = 'My header';
    const badString =
      '<body><h3>' + header + '</h3><dl><a href="link">txt</a></body>';

    expect(() => getHeaderNextDlSiblingLinks(badString, header)).toThrow(Error);
  });
});
