import pug from 'pug';
import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks(); 

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '../../views/Directory.pug');

const compiledTemplate = pug.compileFile(templatePath);


describe('Directory Pug Template', () => {

  it('should render the correct number of links', () => {
    const html = compiledTemplate({ user_id: 1 });
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('.navLinks');
    expect(links.length).toBe(5);
  })

  it('should render a search input', () => {
    const html = compiledTemplate({ user_id: 1 });
    const dom = new JSDOM(html);
    const searchInput = dom.window.document.querySelector('#directory-search-input');
    expect(searchInput).not.toBeNull();
  });

  it('should render the correct status options in the dropdown', () => {
    const html = compiledTemplate({ user_id: 1 });
    const dom = new JSDOM(html);
    const statusOptions = dom.window.document.querySelectorAll('#status-dropdown .status-options');
    const optionTexts = Array.from(statusOptions).map(option => option.textContent.trim());
    expect(optionTexts).toEqual(['OK', 'Help', 'Emergency']);
  })

  
});