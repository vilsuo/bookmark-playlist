import { createFolderLinks } from '../../src/bookmark/htmlParser';

type Attributes = Record<string, string>;

type HeaderType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type ElementType = 'a' | 'p' | HeaderType | 'dl' | 'dt' | 'body';

type HtmlElement = {
  tag: ElementType;
  attributes?: Attributes;
  content: string | HtmlElement | Array<HtmlElement>;
};

/**
 * <a href="someUrl" add_date="someUnixEpoch" { ...attributes }>{content}</a>
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
  content: LinkElement;
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
  content: [HeaderElement, DlElement, ParagraphElement];
};

/**
 * <dl>
 *    <p />
 *    <dt />
 *      .
 *      .
 *      .
 *    <dt />
 * </dl>
 */
type DlElement = {
  tag: 'dl';
  content: [ParagraphElement, ...Array<DtSingleElement | DtFolderElement>];
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

const isElementArray = (value: unknown): value is HtmlElement[] => {
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
  indent = 0, // used only for pretty printing
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
  describe('folder in root with a single link', () => {
    const links = createFolderLinks(parsedBody, SINGLE_LINK_HEADER);

    it('one link is found', () => {
      expect(links).toHaveLength(1);
    });

    describe('attributes', () => {
      it('href is the link href attribute', () => {
        expect(links[0].href).toBe(linkHrefTemplate + 0);
      });

      it('add_date is the link add_date attribute', () => {
        expect(links[0].addDate).toBe(linkAddDateTemplate.toString());
      });

      it('text is the link text content', () => {
        expect(links[0].text.trim()).toBe(linkTextTemplate + 0);
      });

      it('folder is the link parent folder header', () => {
        expect(links[0].folder).toBe(SINGLE_LINK_HEADER);
      });
    });
  });

  describe('folder in root with two links', () => {
    const links = createFolderLinks(parsedBody, DOUBLE_LINK_HEADER);

    it('finds two links', () => {
      expect(links).toHaveLength(2);
    });
  });

  describe('nested folder', () => {
    const links = createFolderLinks(parsedBody, CHILD_FOLDER_HEADER);

    it('finds only links inside the nested folder', () => {
      expect(links).toHaveLength(2);
    });

    it('folder attribute is the nested folder name', () => {
      for (const link of links) {
        expect(link.folder).toBe(CHILD_FOLDER_HEADER);
      }
    });
  });

  describe('folder in root with a sub folder', () => {
    const links = createFolderLinks(parsedBody, PARENT_FOLDER_HEADER);

    it('finds links inside the folder and the nested folder', () => {
      expect(links).toHaveLength(3);
    });

    describe('folder attribute of the links', () => {
      it('not inside of the nested folder is the folder name', () => {
        expect(links[2].folder).toBe(PARENT_FOLDER_HEADER);
      });
  
      it('inside of the nested folder is the nested folder name', () => {
        expect(links[0].folder).toBe(CHILD_FOLDER_HEADER);
        expect(links[1].folder).toBe(CHILD_FOLDER_HEADER);
      });
    });
  });

  describe('root folder', () => {
    const links = createFolderLinks(parsedBody, ROOT_HEADER);

    it('finds all links', () => {
      expect(links).toHaveLength(10);
    });

    it('the folder attribute of each link is the containing folder header name', () => {
      expect(links[0].folder).toBe(SINGLE_LINK_HEADER);
      expect(links[1].folder).toBe(ROOT_HEADER);
      expect(links[2].folder).toBe(DOUBLE_LINK_HEADER);
      expect(links[3].folder).toBe(DOUBLE_LINK_HEADER);
      expect(links[4].folder).toBe(ROOT_HEADER);
      expect(links[5].folder).toBe(CHILD_FOLDER_HEADER);
      expect(links[6].folder).toBe(CHILD_FOLDER_HEADER);
      expect(links[7].folder).toBe(PARENT_FOLDER_HEADER);
      expect(links[8].folder).toBe(ROOT_HEADER);
      expect(links[9].folder).toBe(ROOT_HEADER);
    });
  });

  it('error is thrown when header is not found', () => {
    const missingHeader = 'This does not exist';

    expect(() =>
      createFolderLinks(parsedBody, missingHeader),
    ).toThrow(Error);
  });

  it('error is thrown if parent tag is not closed', () => {
    const header = 'My header';
    const badString =
      '<body><h3>' + header + '</h3><dl><a href="link">txt</a></body>';

    expect(() => createFolderLinks(badString, header)).toThrow(
      /tag 'dl' was not/i,
    );
  });
});
