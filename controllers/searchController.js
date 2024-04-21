import * as searchService from "../services/searchService.js";
import {searchStrategies} from "../stratrgies/search.strategies.js";

export async function search(req, res) {
    const { q: searchQuery, domain: searchDomain, senderId, receiverId, threadId , tags, urgency} = req.query;

    const strategy = searchStrategies[searchDomain];
    if (!strategy) {
        return res.status(400).json({ success: false, message: "Invalid search domain" });
    }

    try {
        const args = searchDomain === 'PrivatePosts' ? [searchQuery, senderId, receiverId] :
            searchDomain === 'StatusHistory' ? [receiverId] :
            searchDomain === 'ThreadPosts' ? [searchQuery, threadId] :
            searchDomain === 'ThreadsWithTags' ? [searchQuery, tags, urgency] :
                [searchQuery, urgency];

        const result = await strategy(...args);
        res.status(200).json({
            success: true,
            data: result.data,
            message: `${searchDomain} query '${searchQuery || receiverId || threadId }' successful.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}