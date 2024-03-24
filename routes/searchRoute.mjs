/**
 * @swagger
 * /search:
 *  get:
 *    tags:
 *      - Search
 *    summary: Search across specified domains
 *    parameters:
 *      - in: query
 *        name: q
 *        type: string
 *        required: true
 *        description: The search query term.
 *      - in: query
 *        name: domain
 *        type: string
 *        required: false
 *        description: The search domain (e.g., announcements, posts, privatePosts, users). Leave empty for a global search.
 *    responses:
 *      200:
 *        description: Successful search.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: object
 *                  properties:
 *                    announcements:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          announcementId:
 *                            type: integer
 *                          userId:
 *                            type: integer
 *                          content:
 *                            type: string
 *                          time:
 *                            type: string
 *                    posts:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          postId:
 *                            type: integer
 *                          userId:
 *                            type: integer
 *                          content:
 *                            type: string
 *                          time:
 *                            type: string
 *                    privatePosts:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          privatePostId:
 *                            type: integer
 *                          senderId:
 *                            type: integer
 *                          receiverId:
 *                            type: integer
 *                          content:
 *                            type: string
 *                          time:
 *                            type: string
 *                    users:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          userId:
 *                            type: integer
 *                          username:
 *                            type: string
 *                message:
 *                  type: string
 *      400:
 *        description: Invalid search query or domain.
 */

