import {DataTypes, Op} from "sequelize";

export class ResourceUnit {
    static model = null;
    static initModel(sequelize) {
        this.model = sequelize.define('resource_unit', {
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
    static async addUnit(unitName) {
        return await this.model.create({name: unitName});
    }

    static async getUnits() {
        return await this.model.findAll();
    }

    static async ifExist(unitName) {
        const result = await this.model.findAll({
            where: { name: unitName },
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