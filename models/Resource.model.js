import {DataTypes, Op}  from "sequelize";
import {User} from "./User.model.js";
import {ResourceType} from "./ResourceType.model.js";
import {ResourceUnit} from "./ResourceUnit.model.js";
import DatabaseAdapter from "../config/DatabaseAdapter.js";


export class Resource {
    static model = null;
    static initModel(sequelize) {
        this.model = sequelize.define('resource', {
            resource_id: {
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
            resource_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: ResourceType.model,
                    key: 'id'
                }
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            resource_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            resource_unit_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: ResourceUnit.model,
                    key: 'id'
                }
            },
            resource_note: {
                type: DataTypes.STRING,
            },
            resource_latitude: {
                type: DataTypes.FLOAT
            },
            resource_longitude: {
                type: DataTypes.FLOAT
            },
            tel: {
                type: DataTypes.STRING
            }
        });

        this.model.belongsTo(User.model, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
        User.model.hasMany(this.model, {
            foreignKey: 'user_id'
        });
        this.model.belongsTo(ResourceType.model, {
            foreignKey: 'resource_type_id',
            onDelete: 'CASCADE'
        });
        ResourceType.model.hasMany(this.model, {
            foreignKey: 'resource_type_id'
        });
        this.model.belongsTo(ResourceUnit.model, {
            foreignKey: 'resource_unit_id',
            onDelete: 'CASCADE'
        });
        ResourceUnit.model.hasMany(this.model, {
            foreignKey: 'resource_unit_id'
        });
    }

    static async createResourcePost(userId, resourceTypeId, resourceName, resourceAmount, resourceUnitId, note, latitude, longitude, tel) {
        try {
            return await this.model.create({
                user_id: userId,
                resource_type_id: resourceTypeId,
                resource_name: resourceName,
                resource_amount: resourceAmount,
                resource_unit_id: resourceUnitId,
                resource_note: note,
                resource_latitude: latitude,
                resource_longitude: longitude,
                tel: tel
            });
        } catch (error) {
            console.error("Failed to create resource post:", error);
            throw error;  // Re-throw the error to be handled or logged by the caller
        }
    }
    static async getResourcePosts() {
        return await this.model.findAll({
            include: [{
                model: User.model,
                attributes: ['username']
            }, {
                model: ResourceType.model,
                attributes: ['name']
            }, {
                model: ResourceUnit.model,
                attributes: ['name']
            }]
        });
    }

    static async getResourceByUser(userId) {
        return await this.model.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: User.model,
                attributes: ['username']
            }, {
                model: ResourceType.model,
                attributes: ['name']
            }, {
                model: ResourceUnit.model,
                attributes: ['name']
            }]
        });
    }

    static async getResourcePostsGrouped(userLat, userLong) {
        const query = `
        SELECT 
            resource_name as name,
            resource_type.name as type,
            resource_unit as unit,
            SUM(resource_amount) AS total_amount,
            (6371 * acos(
                cos(radians(:userLat)) * cos(radians(resource_latitude)) 
                * cos(radians(resource_longitude) - radians(:userLong)) 
                + sin(radians(:userLat)) * sin(radians(resource_latitude))
            )) AS distance
        FROM
            resource, resource_type, resource_unit
        WHERE
            resource_amount > 0 and resource.resource_type == resource_type.id and resource.resource_unit == resource_unit.id
        GROUP BY
            resource_name, resource_type_id, resource_unit
        ORDER BY
            distance
        LIMIT 1;
    `;

        try {
            const sequelize = DatabaseAdapter.getDatabase();
            const aggregatedResources = await sequelize.query(query, {
                replacements: { userLat: userLat, userLong: userLong },
                type: sequelize.QueryTypes.SELECT
            });
            return aggregatedResources;
        } catch (error) {
            console.error('Error fetching aggregated resources with closest location:', error);
            throw error;
        }
    }

    static async getResourceById(resourceId) {
        return await this.model.findByPk(resourceId);
    }

    /*
    {
    resource_name: "New Resource Name",
    resource_amount: 150,
    resource_unit: 2,
    resource_note: "Updated note",
    resource_latitude: 34.0522,
    resource_longitude: -118.2437
}
     */
    static async updateResourceById(resourceId, updateData) {
        return await this.model.update(updateData, {
            where: {
                resource_id: resourceId
            }
        })
    }

    static async deleteResource(resourceId) {
        return await this.model.destroy({
            where: {
                resource_id: resourceId
            }
        })
    }
}