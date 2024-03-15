//import { getHeaderRange } from '../../src/util/linkParser';

type Attributes = Record<string, string>;

type HtmlElement = {
  tag: string;
  attributes?: Attributes;
  content: string | HtmlElement | Array<HtmlElement>;
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

const linkElements: Array<HtmlElement> = [
  {
    tag: 'a',
    attributes: { href: 'http://localhost:3000/link1' },
    content: 'Link1'
  },
  {
    tag: 'a',
    attributes: { href: 'http://localhost:3000/link2' },
    content: 'Link2'
  },
];

const parentElement: HtmlElement = {
  tag: 'dl',
  content: linkElements,
};

describe('getHeaderRange', () => {
  it('initial test', () => {
    console.log('test', parseElement(parentElement));
  });
});
