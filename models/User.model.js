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
            }
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
    static async createUser(username, password) {
        return await this.model.create({ username: username, password: password, status: "place_holder", online_status: "online" });
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
     * @param {integer} id The user id
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
     * @param {integer} id The user id
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


}