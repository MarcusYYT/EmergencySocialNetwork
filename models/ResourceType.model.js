import {DataTypes, Op} from "sequelize";

export class ResourceType {
    static model = null;
    static initModel(sequelize) {
        this.model = sequelize.define('resource_type', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
    }
    static async addType(typeName) {
        return await this.model.create({name: typeName});
    }

    static async getTypes() {
        return await this.model.findAll();
    }

    static async ifExist(typeName) {
        const result = await this.model.findAll({
            where: { name: typeName },
        });
        if (result.length === 0) {
            // user does not exist
            return false;
        } else {
            // user exist
            return true;
        }
    }
}