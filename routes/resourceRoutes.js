import express from "express";
import {
    getResourceGrouped,
    getResourceList,
    postResource,
    updateResource,
    getResourceById,
    addResourceUnit,
    addResourceType, deleteResource, getResourceTypes, getResourceUnits, getResourceByUserId
} from "../controllers/resourceController.js";


const router = express.Router();

/**
 * @swagger
 * /resources/{resourceId}:
 *  get:
 *    tags:
 *      - Resources
 *    summary: Fetch a resource offering by the resourceId
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to get.
 *    responses:
 *      200:
 *        description: Successfully retrieved the resource.
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
 *                    resourceId:
 *                      type: integer
 *                    offererId:
 *                      type: integer
 *                    resourceType:
 *                      type: string
 *                    amount:
 *                      type: number
 *                    unit:
 *                      type: string
 *                    location:
 *                      type: string
 *                    contactInfo:
 *                      type: string
 *                message:
 *                  type: string
 *      404:
 *        description: Resource not found
 *
 * /resources:
 *  get:
 *    tags:
 *      - Resources
 *    summary: Fetch a list of all resource offerings
 *    responses:
 *      200:
 *        description: Successfully returned the resource list.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      resourceId:
 *                        type: integer
 *                      offererId:
 *                        type: integer
 *                      resourceType:
 *                        type: string
 *                      amount:
 *                        type: number
 *                      unit:
 *                        type: string
 *                      location:
 *                        type: string
 *                      contactInfo:
 *                        type: string
 *                message:
 *                  type: string
 *  post:
 *    tags:
 *      - Resources
 *    summary: Post a new resource offering into the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              offererId:
 *                type: integer
 *              resourceType:
 *                type: string
 *              amount:
 *                type: number
 *              unit:
 *                type: string
 *              location:
 *                type: string
 *              contactInfo:
 *                type: string
 *    responses:
 *      201:
 *        description: Database insert successful
 *
 * /resources/search:
 *  get:
 *    tags:
 *      - Resources
 *    summary: Search for resources based on specified filters
 *    parameters:
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: Filter by resource type
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: Filter by resource name
 *      - in: query
 *        name: location
 *        schema:
 *          type: string
 *        description: Filter by location proximity
 *    responses:
 *      200:
 *        description: Successfully retrieved matching resources.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      resourceId:
 *                        type: integer
 *                      resourceType:
 *                        type: string
 *                      amount:
 *                        type: number
 *                      unit:
 *                        type: string
 *                      location:
 *                        type: string
 *                      distance:
 *                        type: string
 *                      contactInfo:
 *                        type: string
 *                message:
 *                  type: string
 *      404:
 *        description: No resources found matching the criteria
 *
 * /resources/details/{resourceId}:
 *  get:
 *    tags:
 *      - Resources
 *    summary: Get detailed information about a specific resource
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to get detailed information for.
 *    responses:
 *      200:
 *        description: Successfully retrieved detailed resource information.
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
 *                    resourceId:
 *                      type: integer
 *                    offererId:
 *                      type: integer
 *                    resourceType:
 *                      type: string
 *                    amount:
 *                      type: number
 *                    unit:
 *                      type: string
 *                    location:
 *                      type: string
 *                    contactInfo:
 *                      type: string
 *                    notes:
 *                      type: string
 *                message:
 *                  type: string
 *      404:
 *        description: Resource not found
 *
 * /resources/contact/{resourceId}:
 *  post:
 *    tags:
 *      - Resources
 *    summary: Initiate contact with the resource offerer
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource for which to initiate contact.
 *    responses:
 *      200:
 *        description: Contact initiation successful.
 *      400:
 *        description: Error in contact initiation process.
 * /resources/edit/{resourceId}:
 *  get:
 *    tags:
 *      - Resources
 *    summary: Retrieve a resource for editing by the resourceId
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to retrieve for editing.
 *    responses:
 *      200:
 *        description: Successfully retrieved the resource for editing.
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
 *                    resourceId:
 *                      type: integer
 *                    resourceType:
 *                      type: string
 *                    amount:
 *                      type: number
 *                    unit:
 *                      type: string
 *                    location:
 *                      type: string
 *                    contactInfo:
 *                      type: string
 *                message:
 *                  type: string
 *      404:
 *        description: Resource not found
 *
 * /resources/update/{resourceId}:
 *  put:
 *    tags:
 *      - Resources
 *    summary: Update details of a resource
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to update.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              resourceType:
 *                type: string
 *              amount:
 *                type: number
 *              unit:
 *                type: string
 *              location:
 *                type: string
 *              contactInfo:
 *                type: string
 *    responses:
 *      200:
 *        description: Successfully updated the resource.
 *      400:
 *        description: Validation error or update failure.
 *      404:
 *        description: Resource not found.
 *
 * /resources/delete/{resourceId}:
 *  delete:
 *    tags:
 *      - Resources
 *    summary: Delete a resource
 *    parameters:
 *      - in: path
 *        name: resourceId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the resource to delete.
 *    responses:
 *      200:
 *        description: Successfully deleted the resource.
 *      404:
 *        description: Resource not found.
 */



router.get('', getResourceGrouped);
router.get('/grouped', getResourceGrouped);
router.get('/get/:resourceId', getResourceById);
router.get('/list', getResourceList);
router.post('/post', postResource);
router.put('/post', updateResource);
router.delete('/delete/:resourceId', deleteResource);
router.get('/units', getResourceUnits);
router.get('/types', getResourceTypes);
router.post('/addUnit', addResourceUnit);
router.post('/addType', addResourceType);
router.get('/list/:userId', getResourceByUserId);

export default router;