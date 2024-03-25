import * as searchService from '../services/searchService.js';

export const searchStrategies = {
    'User': (query) => searchService.searchUser(query),
    'Status': (query) => searchService.searchUserStatus(query),
    'Announcements': (query) => searchService.searchAnnouncements(query),
    'Posts': (query) => searchService.searchPosts(query),
    'PrivatePosts': (query, senderId, receiverId) => searchService.searchPrivatePosts(senderId, receiverId, query),
    'StatusHistory': (receiverId) => searchService.searchStatusHistory(receiverId),
};