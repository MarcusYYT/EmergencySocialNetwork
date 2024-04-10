import { DataTypes } from 'sequelize';
import { User } from './User.model.js';

export class Subscriber {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('subscriber', {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            subscriber_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            }
        },
        {
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'subscriber_id']
                }
            ]
        });

        User.model.hasMany(this.model, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        User.model.hasMany(this.model, { foreignKey: 'subscriber_id', onDelete: 'CASCADE' });
        this.model.belongsTo(User.model, { as: 'User', foreignKey: 'user_id' });
        this.model.belongsTo(User.model, { as: 'Subscriber', foreignKey: 'subscriber_id' });
    }

    static async addSubscriber(userId, subscriberId) {
        return await this.model.create({
            user_id: userId,
            subscriber_id: subscriberId
        });
    }

    static async getSubscribers(userId) {
        return await this.model.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: User.model,
                    as: 'Subscriber',
                    attributes: ['user_id']
                }
            ]
        });
    }
}