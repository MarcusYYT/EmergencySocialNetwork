import pug from 'pug';
import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks(); 

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '../../views/Announcement.pug');

const compiledTemplate = pug.compileFile(templatePath);

describe('Announcements Pug Template', () => {
    it('should render a search form and submit search request', () => {
      const html = compiledTemplate({ user_id: 1 });
      const dom = new JSDOM(html);
      const searchForm = dom.window.document.querySelector('.search-form');
      expect(searchForm).not.toBeNull();
      expect(searchForm.getAttribute('onsubmit')).toBe('submitSearch()');
    });
  
    it('should allow posting an announcement and update the announcement board', () => {
      const html = compiledTemplate({ user_id: 1 });
      const dom = new JSDOM(html);
      const postForm = dom.window.document.querySelector('#post-form');
      const messageInput = dom.window.document.querySelector('#message');
      const postButton = dom.window.document.querySelector('#post-btn');
      expect(postForm).not.toBeNull();
      expect(messageInput).not.toBeNull();
      expect(postButton.getAttribute('onclick')).toBe('postAnnouncement()');
    });
  
    it('should render a empty announcement board', () => {
      const html = compiledTemplate({ user_id: 1 });
      const dom = new JSDOM(html);
      const announcementBoard = dom.window.document.querySelector('#announcement-board');
      expect(announcementBoard.children.length).toBe(0);
    });
})