import {DataTypes, Op} from 'sequelize'

export class User {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('user', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            online_status: {
                type: DataTypes.STRING,
                allowNull: false
            }, 
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            privilege: {
                type: DataTypes.ENUM,
                values: ['Citizen', 'Coordinator', 'Administrator'],
                allowNull: false,
                defaultValue: 'Citizen'
            },
        }, 
        {
            freezeTableName: true
        });
    }
    /**
     * This function will insert one row into user table, with increment user_id, username and password
     * @param {string} username 
     * @param {string} password 
     */
    static async createUser(username, password, previlege='Citizen', status='place_holder') {
        return await this.model.create({
            username: username, 
            password: password,
            status: status,
            online_status: "online",
            isActive: true,
            privilege: previlege
        });
    }

    /**
     * The function to check if a user exists in database by username
     * @param {string} username The username passed from the frontend
     * @returns {Promise} The function will return true if the username exists in the database. Otherwise return false
     */
    static async ifUserExist(username) {
        const result = await this.model.findAll({
          where: { username: username },
        });
        if (result.length === 0) {
          // user does not exist
          return false;
        } else {
          // user exist
          return true;
        }
    }

    /**
     * Find the user with input username in User table
     * @param {string} username The username as the string 
     * @returns {Promise} a list with user object which match the username, empty array will be return if username not exist in database
     */
    static async getOneUser(username){
        return await this.model.findAll({
            where: { username: username },
        });
    }
    /**
     * Get the full list of user
     * @returns {Promise} a list with all user in User table
     */
    static async getUserList(){
        return await this.model.findAll();
    }

    /**
     * This fnction will query the database to find a user, or output all user if no user specificed
     * @param {string} [username] - username is optional
     * @returns {Promise} If no parameter passed, it will return all the user, if username parameter passed, it will return the specific user
     */
    static async getUser(username=null){
        if(username != null){
            return await this.getOneUser(username);
        } else {
            return await this.getUserList();
        }
    }


    /**
     * Query the users by username
     * @param {string} query The query keyword
     * @returns {Promise} a promise containing the users gotten from the query
     */
    static async queryUser(query) {
        return await this.model.findAll({
            where: {
                username: {[Op.like]: `%${query}%`}
            }
        });
    }

    /**
     * Query the userstatus by status name
     * @param {string} query The status keyword
     * @returns {Promise} the user statuses gotten from the query
     * 
     */
    static async queryUserStatus(query) {
        return await this.model.findAll({
            where: {
                status: {[Op.like]: `%${query}%`}
            }
        });
    }

    /**
     * Gets a user from the database using their id
     * @param {string} user_id The user id of the user to get
     * @returns {Promise} the user statuses gotten from the query
     * 
     */
    static async getUserById(user_id){
        return await this.model.findByPk(user_id)
    
    }

    /**
     * Change the online status of the sepcific user id
     * @param {number} id The user id
     * @param {string} status The status wants to be changed to
     * @returns {Promise} the online status that was edited in the database
     */
    static async changeOnlineStatus(id, status){
        return await this.model.update({online_status:status},{
            where: {
                user_id: id
            }
        })
    }

    
    /**
     * Change the status of the sepcific user id
     * @param {number} id The user id
     * @param {string} status The status wants to be changed to
     * @returns {Promise} the status that was edited in the database
     */
    static async changeStatus(id, status){
        return await this.model.update({status:status},{
            where: {
                user_id: id
            }
        })
    }

    /**
     * Change the active status of a specific user.
     * @param {number} user_id The ID of the user whose active status is to be changed.
     * @param {boolean} newIsActive The new active status.
     * @returns {Promise} A promise that resolves with the update operation result.
     */
    static async changeActiveStatus(user_id, newIsActive) {
        return await this.model.update({ isActive: newIsActive }, {
            where: {
                user_id: user_id
            }
        });
    }

    /**
     * Change the privilege of a specific user.
     * @param {number} user_id The ID of the user whose privilege is to be changed.
     * @param {string} newPrivilege The new privilege to set.
     * @returns {Promise} A promise that resolves with the update operation result.
     */
    static async changePrivilege(user_id, newPrivilege) {
        return await this.model.update({ privilege: newPrivilege }, {
            where: {
                user_id: user_id
            }
        });
    }

    /**
     * Change the password of a specific user.
     * @param {number} user_id The ID of the user whose password is to be changed.
     * @param {string} hashedPassword The new hashed password.
     * @returns {Promise} A promise that resolves with the update operation result.
     */
    static async changePassword(user_id, hashedPassword) {
        return await this.model.update({ password: hashedPassword }, {
            where: {
                user_id: user_id
            }
        });
    }

    /**
     * Change the username of a specific user.
     * @param {number} user_id The ID of the user whose username is to be changed.
     * @param {string} newUsername The new username to set.
     * @returns {Promise} A promise that resolves with the update operation result.
     */
    static async changeUsername(user_id, newUsername) {
        return await this.model.update({ username: newUsername }, {
            where: {
                user_id: user_id
            }
        });
    }

    

}