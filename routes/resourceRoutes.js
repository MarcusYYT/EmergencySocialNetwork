import express from "express";
import {
    getResourceGrouped,
    getResourceList,
    postResource,
    updateResource,
    getResourceById,
    addResourceUnit,
    addResourceType, deleteResource, getResourceTypes, getResourceUnits, getResourceByUserId, getResourceByType
} from "../controllers/resourceController.js";


const router = express.Router();
/**
 * @swagger
 * paths:
 *   /resources/{resourceId}:
 *     get:
 *       tags:
 *         - Resources
 *       summary: "Fetch a resource by its ID"
 *       parameters:
 *         - in: path
 *           name: resourceId
 *           required: true
 *           schema:
 *             type: integer
 *           description: "The ID of the resource to retrieve"
 *       responses:
 *         200:
 *           description: "Successfully retrieved the resource."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Resource'
 *         404:
 *           description: "Resource not found"
 *         500:
 *           description: "Server error"
 *       security:
 *         - ApiKeyAuth: []
 *   /resources/grouped:
 *     get:
 *       tags:
 *         - Resources
 *       summary: "Fetch resources grouped by type"
 *       responses:
 *         200:
 *           description: "Successfully grouped resources."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/GroupedResource'
 *         500:
 *           description: "Server error"
 *   /resources/list:
 *     get:
 *       tags:
 *         - Resources
 *       summary: "Fetch a list of all resources"
 *       responses:
 *         200:
 *           description: "Successfully returned the resource list."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Resource'
 *         500:
 *           description: "Server error"
 *   /resources/post:
 *     post:
 *       tags:
 *         - Resources
 *       summary: "Create a new resource"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewResource'
 *       responses:
 *         201:
 *           description: "Resource created successfully"
 *         500:
 *           description: "Server error"
 *   /resources/update/{resourceId}:
 *     put:
 *       tags:
 *         - Resources
 *       summary: "Update an existing resource"
 *       parameters:
 *         - in: path
 *           name: resourceId
 *           required: true
 *           schema:
 *             type: integer
 *           description: "The ID of the resource to update"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewResource'
 *       responses:
 *         200:
 *           description: "Resource updated successfully"
 *         404:
 *           description: "Resource not found"
 *         500:
 *           description: "Server error"
 *   /resources/delete/{resourceId}:
 *     delete:
 *       tags:
 *         - Resources
 *       summary: "Delete a resource"
 *       parameters:
 *         - in: path
 *           name: resourceId
 *           required: true
 *           schema:
 *             type: integer
 *           description: "The ID of the resource to delete"
 *       responses:
 *         200:
 *           description: "Resource deleted successfully"
 *         404:
 *           description: "Resource not found"
 *         500:
 *           description: "Server error"
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         resourceId:
 *           type: integer
 *         offererId:
 *           type: integer
 *         resourceType:
 *           type: string
 *         amount:
 *           type: number
 *         unit:
 *           type: string
 *         location:
 *           type: string
 *         contactInfo:
 *           type: string
 *     NewResource:
 *       type: object
 *       required:
 *         - user_id
 *         - resource_type_id
 *         - resource_name
 *         - resource_amount
 *         - resource_unit_id
 *         - resource_note
 *         - latitude
 *         - longitude
 *         - tel
 *       properties:
 *         user_id:
 *           type: integer
 *         resource_type_id:
 *           type: integer
 *         resource_name:
 *           type: string
 *         resource_amount:
 *           type: number
 *         resource_unit_id:
 *           type: integer
 *         resource_note:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         tel:
 *           type: string
 * securitySchemes:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-KEY
 */



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
router.get('/grouped', getResourceGrouped);
router.get('/type/:typeId', getResourceByType);

export default router;