import { DataTypes } from 'sequelize';
import { User } from './User.model.js';
import {Preference} from './Preference.model.js'

export class Subscriber {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('subscriber', {
            master_id: {
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
        });

        User.model.hasMany(this.model, { foreignKey: 'master_id', onDelete: 'CASCADE' });
        this.model.belongsTo(User.model, { as: 'User', foreignKey: 'master_id' });
        this.model.belongsTo(User.model, { as: 'Subscriber', foreignKey: 'subscriber_id' });
    }

    static async addSubscriber(userId, subscriberId) {
        const existingSubscription = await this.model.findOne({
            where: {
                master_id: userId,
                subscriber_id: subscriberId
            }
        });

        if (existingSubscription) {
            return false;
        }
        return await this.model.create({
            master_id: userId,
            subscriber_id: subscriberId
        });
    }

    static async getSubscribers(subscriberId) {
        return await this.model.findAll({
            where: { subscriber_id: subscriberId },
            include: [
                {
                    model: User.model,
                    as: 'User', 
                    attributes: ['user_id', 'username']
                }
            ]
        });
    }

    static async removeSubscriber(userId, subscriberId) {
        return await this.model.destroy({
            where: {
                master_id: userId,
                subscriber_id: subscriberId
            }
        });
    }

    static async getSubscribersWithDetails(userId) {
        const subscribers =  await this.model.findAll({
            where: { master_id: userId },
            include: [
                {
                    model: User.model,
                    as: 'Subscriber',
                    attributes: ['user_id', 'username', 'status'],
                    include: [
                        {
                            model: Preference.model,
                            attributes: ['email', 'status_changes', 'email_notification_preference']
                        }
                    ], 
                }
            ], 
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        return subscribers.map(element => {
            return {
                user_id: element.Subscriber.user_id,
                username: element.Subscriber.username,
                status: element.Subscriber.status,
                email: element.Subscriber.preference.email, 
                status_changes: element.Subscriber.preference.status_changes,
                email_notification_preference: element.Subscriber.preference.email_notification_preference

            };
        });
    }
}