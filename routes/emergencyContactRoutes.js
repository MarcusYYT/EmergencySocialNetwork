import express from 'express';
const router = express.Router();
import {createEmergencyContact, postAlert, getEmergencyContactByUserId, getEmergencyContactSocketId, updateEmergencyContact, deleteEmergencyContact} from '../controllers/emergencyContactController.js'


/**
* @swagger
* /emergencyContacts/{userId}:
*  get:
*    summary: Fetch an user emergency contact object by the userId
*    tags:
*      - Emergency Contact
*    parameters:
*      - in: path
*        name: userId
*        type: integer
*        required: true
*        description: Numeric ID of the user to get.
*    responses:
*      200:
*        description: Successful return the user emergency contact
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:        
*                  type: boolean
*                data:         
*                  type: array
*                  items:
*                    type: object
*                    properties:
*                      emergency_id:
*                        type: integer
*                      user_Id:
*                        type: integer
*                      primary_Contect_id:
*                        type: integer
*                      alternative_Contect_id:
*                        type: integer
*                      emergency_message:
*                        type: string
*                      share_location:
*                        type: boolean
*                message:
*                  type: string
*      404:
*        description: user emergency contact not found
*
*  put:
*    summary: Update an user emergency contact object by the userId
*    tags:
*      - Emergency Contact
*    parameters:
*      - in: path
*        name: userId
*        type: integer
*        required: true
*        description: Numeric ID of the user to get.
*    requestBody:
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              user_id:        
*                type: integer
*              primary_Contect:
*                type: string
*              alternative_Contect:
*                type: string
*              emergency_message:
*                type: string
*    responses:
*      200:
*        description: Successful update the user emergency contact
*      404:
*        description: user emergency contact not found

*  delete:
*    tags:
*      - Emergency Contact
*    summary: Delete an user emergency contact object by the userId
*    parameters:
*      - in: path
*        name: userId
*        type: integer
*        required: true
*        description: Numeric ID of the user to delete the emergency contact.
*    responses:
*      200:
*        description: Successful deletion of the user emergency contact
*      404:
*        description: User emergency contact not found
*
* /emergencyContacts:
*  post:
*    tags:
*      - Emergency Contact
*    summary: Push a new user emergency contact into database
*    requestBody:
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              emergency_id:
*                type: integer
*              user_Id:
*                type: integer
*              primary_Contect_id:
*                type: integer
*              alternative_Contect_od:
*                type: integer
*              emergency_message:
*                type: string
*              share_location:
*                type: boolean
*    responses:
*      201:
*        description: Database push successful
*      409:
*        description: User Emergency Contact Exist
*      500:
*        description: Database push failed
*
* /emergencyContacts/emergency_alert:
*  post:
*    tags:
*      - Emergency Contact
*    summary: Send emergency alert to user's emergency contact 
*    requestBody:
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              user_Id:
*                type: integer
*              primary_Contect_id:
*                type: integer
*              alternative_Contect_od:
*                type: integer
*              emergency_message:
*                type: string
*              location_allow:
*                type: string
*              location_link:
*                type: string
*    responses:
*      201:
*        description: Post new alert successful
*      500:
*        description: Post new alert failed
*
* /emergencyContacts/{primaryId}/{alternativeId}:
*  Get:
*    summary: Fetch an user emergency contacts object by the userId and get their socket id
*    tags:
*      - Emergency Contact
*    parameters:
 *      - in: path
 *        name: primaryId
 *        schema:
 *          type: integer
 *        description: Numeric ID of the primary contact to get.
 *      - in: path
 *        name: alternativeId
 *        schema:
 *          type: integer
 *        description: Numeric ID of the alternative contact to get.
*    responses:
*      200:
*        description: Socket IDs retrieved successfully
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                success:        
*                  type: boolean
*                data:         
*                  type: array
*                  items:
*                    type: object
*                    properties:
*                      primary_Contect_sockid:
*                        type: string
*                      alternative_Contect_sockid:
*                        type: string
*                message:
*                  type: string
*      500:
*        description: user emergency contact socket id not found
*/

router.get('/:user_id', getEmergencyContactByUserId);
router.get('/:primary_id/:alternative_id', getEmergencyContactSocketId);
router.put('/:user_id', updateEmergencyContact);
router.post('', createEmergencyContact);
router.post('/emergency_alert', postAlert);
router.delete('/:user_id', deleteEmergencyContact);


export default router;