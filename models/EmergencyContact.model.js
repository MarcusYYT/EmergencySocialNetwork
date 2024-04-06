import {DataTypes, Op} from 'sequelize'
import { User } from './User.model.js'

export class EmergencyContact {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('emergency_contact', {
            emergency_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            primary_contact_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: -1,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            alternative_contact_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: -1,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            emergency_message: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'I need HELP!' 
            }
        }, 
        {
            freezeTableName: true
        });

        this.model.belongsTo(User.model, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
        this.model.belongsTo(User.model, { 
            as: 'Primary', 
            foreignKey: 'primary_contact_id',
            onDelete: 'CASCADE'
        });
        this.model.belongsTo(User.model, { 
            as: 'Alternative', 
            foreignKey: 'alternative_contact_id',
            onDelete: 'CASCADE'
        });       
        User.model.hasMany(this.model, {
            foreignKey: 'user_id'
        });
        User.model.hasMany(this.model, { 
            foreignKey: 'primary_contact_id', 
        });
        User.model.hasMany(this.model, { 
            foreignKey: 'alternative_contact_id', 
        });
    }

    /**
     * Create a new Emergency Contact
     * @param {number} userId - The ID of the user who is creating the emergency contact
     * @param {number} primary - The ID of the primary emergency contact
     * @param {number} alternative - The ID of the alternative emergency contact
     * @param {string} message - The emergency message user saved
     * @returns The promise of this method
     */
    static async createEmergencyContact(userId, primary, alternative, message) {
        return await this.model.create({
            user_id: userId,
            primary_contact_id: primary,
            alternative_contact_id: alternative,
            emergency_message: message
        });
    }

      /**
     * The function to check if an user already created emergency contacts by user id
     * @param {number} userId - The ID of the user who is creating the emergency contact
     * @returns The function will return true if the user already created emergency contacts in database. Otherwise return false
     */
    static async ifEmergencyContactExist(userId) {
        const result = await this.model.findAll({
            where: { user_id: userId },
        });
        if (result.length === 0) {
            // user does not created emergency contacts
            return false;
        } else {
            // user already created emergency contacts
            return true;
        }
    }

    /**
     * Change the primary emergency contact of the specific user id
     * @param {integer} userId - The user id
     * @param {number} primary - The ID of the primary emergency contact
     * @returns {Promise} A promise indicating the success or failure of the update operation.
     */
    static async changePrimaryContact(userId, primary) {
        return await this.model.update({ primary_contact_id: primary }, {
            where: {
                user_id: userId
            }
        });
    }

    /**
     * Change the alternative emergency contact of the specific user id
     * @param {integer} userId - The user id
     * @param {number} alternative - The ID of the alternative emergency contact
     * @returns {Promise} A promise indicating the success or failure of the update operation.
     */
    static async changeAlternativeContact(userId, alternative) {
        return await this.model.update({ alternative_contact_id: alternative }, {
            where: {
                user_id: userId
            }
        });
    }

    /**
     * Change the emergency message of the specific user id
     * @param {integer} userId - The user id
     * @param {string} message - The emergency message
     * @returns {Promise} A promise indicating the success or failure of the update operation.
     */
    static async changeEmergencyMessage(userId, message) {
        return await this.model.update({ emergency_message: message }, {
            where: {
                user_id: userId
            }
        });
    }

    
    /**
     * Get emergency contact by user ID
     * @param {number} userId - The ID of the user
     * @returns {Promise} A promise resolving to the emergency contact with the given user ID, or null if not found
     */
    static async getEmergencyContactByUserId(userId) {
        return await this.model.findAll({
            where: {
                user_id: userId
            }
        });
    }
}