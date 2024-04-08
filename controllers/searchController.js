import * as searchService from "../services/searchService.js";
import {searchStrategies} from "../stratrgies/search.strategies.js";

export async function search(req, res) {
    const { q: searchQuery, domain: searchDomain, senderId, receiverId, threadId , tags} = req.query;

    const strategy = searchStrategies[searchDomain];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid search domain" });
    }

    try {
        const args = searchDomain === 'PrivatePosts' ? [searchQuery, senderId, receiverId] :
            searchDomain === 'StatusHistory' ? [receiverId] :
            searchDomain === 'ThreadPosts' ? [searchQuery, threadId] :
            searchDomain === 'ThreadsWithTags' ? [searchQuery, tags] :
                [searchQuery];

        const result = await strategy(...args);
        res.status(200).json({
            success: true,
            data: result.data,
            message: `${searchDomain} query '${searchQuery || receiverId || threadId || threadName}' successful.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
    // const searchQuery = req.query.q;
    // const searchDomain = req.query.domain;
    // console.log(`searchQuery: ${searchQuery}`);
    // switch (searchDomain) {
    //     case 'User':
    //         try {
    //             await searchService.searchUser(searchQuery).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `User query '${searchQuery}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    //     case 'Status':
    //         try {
    //             await searchService.searchUserStatus(searchQuery).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `User Status query '${searchQuery}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    //     case 'Announcements':
    //         try {
    //             await searchService.searchAnnouncements(searchQuery).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `Announcements query '${searchQuery}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    //     case 'Posts':
    //         try {
    //             await searchService.searchPosts(searchQuery).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `Posts query '${searchQuery}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    //     case 'PrivatePosts':
    //         try {
    //             const senderId = req.query.senderId;
    //             const receiverId = req.query.receiverId;
    //             await searchService.searchPrivatePosts(senderId, receiverId, searchQuery).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `Private Posts query '${searchQuery}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    //     case 'StatusHistory':
    //         try {
    //             const receiverId = req.query.receiverId;
    //             await searchService.searchStatusHistory(receiverId).then((resolve) => {
    //                 res.status(200).json({
    //                     success: true,
    //                     data: resolve.data,
    //                     message: `Status history query form user '${receiverId}' successful.`
    //                 })
    //             })
    //         } catch (error) {
    //             console.error(error);
    //             res.status(500).send(error.message);
    //         }
    //         break;
    // }
}