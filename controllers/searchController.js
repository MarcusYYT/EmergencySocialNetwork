import * as searchService from "../services/searchService.js";

export async function search(req, res) {
    const searchQuery = req.query.q;
    const searchDomain = req.query.domain;
    console.log(`searchQuery: ${searchQuery}`);
    switch (searchDomain) {
        case 'User':
            try {
                await searchService.searchUser(searchQuery).then((resolve) => {
                    res.status(200).json({
                        success: true,
                        data: resolve.data,
                        message: `User query '${searchQuery}' successful.`
                    })
                })
            } catch (error) {
                console.error(error);
                res.status(500).send(error.message);
            }

    }
}