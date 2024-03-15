//import { getHeaderRange } from '../../src/util/linkParser';

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
  attributes: Attributes & { href: string; };
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
  attributes?: Attributes;
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
  return (value !== null && typeof value === 'object' && 'tag' in value);
};

const isElementArray = (value: unknown): value is Array<HtmlElement> => {
  return (Array.isArray(value) && value.filter(c => isElement(c)).length === value.length);
};

const parseAttributes = (attributes: Attributes) => {
  return Object.keys(attributes)
    .map((attr) => `${attr}="${attributes[attr]}"`)
    .join(' ');
};

const parseElement = ({ tag, attributes, content }: HtmlElement) => {
  const attributeString = attributes
    ? ' ' + parseAttributes(attributes)
    : '';

  let children = '';
  if (typeof content === 'string')  children = content;
  else if (isElement(content))      children = parseElement(content);
  else if (isElementArray(content)) children = content.map(c => parseElement(c)).join('');

  return `
    <${tag}${attributeString}>
      ${children}
    </${tag}>
  `;
};

// SINGLE 

const createLinkElement = (href: string, text: string): LinkElement => ({
  tag: 'a',
  attributes: { href },
  content: text
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

const createDtFolder = (level: number, headerText: string, dlElement: DlElement): DtFolderElement => ({
  tag: 'dt',
  content: [
    createHeaderElement(level, headerText),
    dlElement,
    createParagraphElement(),
  ],
});

const createDlElement = (dtElements: Array<DtFolderElement | DtSingleElement>): DlElement => ({
  tag: 'dl',
  content: [
    createParagraphElement(),
    ...dtElements,
  ],
});

const createBodyElement = (level: number, headerText: string, dlElement: DlElement): BodyElement => ({
  tag: 'body',
  content: [
    createHeaderElement(level, headerText),
    dlElement,
    createParagraphElement(),
  ]
});

const linktTemplate = 'http://localhost:3000/some/addr/';

// create 10 single dts with links inside
const singles = [...Array(10).keys()].map(
  int => createDtSingle(
    createLinkElement(linktTemplate + int, 'Link' + int)
  )
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
  createDtFolder(3, 'folder 2', dls[1]),
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

// console.log('singles', singles);
// console.log('dls', dls);
// console.log('folders', folders);
// console.log('rootDl', rootDl);
console.log('body', body);

describe('getHeaderRange', () => {
  it('initial test', () => {
    console.log('test', parseElement(body));
  });
});
