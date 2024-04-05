import express from 'express';
const router = express.Router();




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
*/




export default router;