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
  attributes: Attributes & { href: string; add_date: string };
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

const createLinkElement = (
  href: string,
  add_date: string,
  text: string,
): LinkElement => ({
  tag: 'a',
  attributes: { href, add_date },
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

const ROOT_HEADER = 'Bookmarks';
const SINGLE_LINK_HEADER = 'single';
const DOUBLE_LINK_HEADER = 'Double';
const PARENT_FOLDER_HEADER = 'parent';
const CHILD_FOLDER_HEADER = 'child';

const linkHrefTemplate = 'http://localhost:3000/some/addr/';
const linkAddDateTemplate = 1708428277;
const linkTextTemplate = 'Link';

const dtSingles = [...Array(10).keys()].map((int) =>
  createDtSingle(
    createLinkElement(
      linkHrefTemplate + int,
      `${linkAddDateTemplate + int}`,
      linkTextTemplate + int,
    ),
  ),
);

const dtFolders = [
  createDtFolder(3, SINGLE_LINK_HEADER, createDlElement([dtSingles[0]])),
  createDtFolder(
    3,
    DOUBLE_LINK_HEADER,
    createDlElement([dtSingles[2], dtSingles[3]]),
  ),
  createDtFolder(
    3,
    CHILD_FOLDER_HEADER,
    createDlElement([dtSingles[5], dtSingles[6]]),
  ),
];

const parent = createDtFolder(
  3,
  PARENT_FOLDER_HEADER,
  createDlElement([dtFolders[2], dtSingles[7]]), // child
);

/**
 *  <>                // root
 *    <folder>        // single
 *      <link 0 />
 *    </folder>
 *
 *    <link 1 />
 *
 *    <folder>        // double
 *      <link 2 />
 *      <link 3 />
 *    </folder>
 *
 *    <link 4 />
 *
 *    <folder>        // parent
 *      <folder>      // child
 *        <link 5 />
 *        <link 6 />
 *      </folder>
 *
 *      <link 7>
 *    </folder>
 *
 *    <link 8 />
 *    <link 9 />
 * </>
 */
const rootDl = createDlElement([
  dtFolders[0],
  dtSingles[1],
  dtFolders[1],
  dtSingles[4],
  parent,
  dtSingles[8],
  dtSingles[9],
]);

const body = createBodyElement(1, ROOT_HEADER, rootDl);
const parsedBody = parseElement(body);

// console.log('body element', body);
// console.log('parsed', parsedBody);

describe('htmlParser', () => {
  describe('single link', () => {
    const links = getHeaderNextDlSiblingLinks(parsedBody, SINGLE_LINK_HEADER);

    it('finds a single link', () => {
      expect(links).toHaveLength(1);
    });

    it('link href attribute is correct', () => {
      expect(links[0].href).toBe(linkHrefTemplate + 0);
    });

    it('link add_date attribute is correct', () => {
      expect(links[0].addDate).toBe(linkAddDateTemplate.toString());
    });

    it('link text content is correct', () => {
      expect(links[0].title.trim()).toBe(linkTextTemplate + 0);
    });

    it('link category is the header', () => {
      expect(links[0].category).toBe(SINGLE_LINK_HEADER);
    });
  });

  describe('two links', () => {
    const links = getHeaderNextDlSiblingLinks(parsedBody, DOUBLE_LINK_HEADER);

    it('finds both links', () => {
      expect(links).toHaveLength(2);
    });
  });

  describe('sub folder', () => {
    const links = getHeaderNextDlSiblingLinks(parsedBody, CHILD_FOLDER_HEADER);

    it('finds sub folder links', () => {
      expect(links).toHaveLength(2);
    });
  });

  describe('parent folder', () => {
    const links = getHeaderNextDlSiblingLinks(parsedBody, PARENT_FOLDER_HEADER);

    it('finds parent folder and sub folder links', () => {
      expect(links).toHaveLength(3);
    });
  });

  describe('root folder', () => {
    const links = getHeaderNextDlSiblingLinks(parsedBody, ROOT_HEADER);

    it('finds all links', () => {
      expect(links).toHaveLength(10);
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
