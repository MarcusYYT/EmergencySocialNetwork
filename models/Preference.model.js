import { DataTypes } from "sequelize";
import { User } from "./User.model.js";

export class Preference {
    static model = null;

    static initModel(sequelize) {
        this.model = sequelize.define('preference', {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: User.model,
                    key: 'user_id'
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email_notification_preference: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'off',
                validate: {
                    isIn: [['off', 'Ok', 'Help', 'Emergency']]
                }
            },
            announcement_updates: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            private_post_updates: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            public_post_updates: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            status_changes: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        },
        {
            freezeTableName: true
        });

        User.model.hasOne(this.model, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        this.model.belongsTo(User.model, { foreignKey: 'user_id' });
    }

    static async setPreferences(userId, email, trigger, announcementUpdates, privatePostUpdates, publicPostUpdates, statusChanges) {
        return await this.model.upsert({
            user_id: userId,
            email: email,
            email_notification_preference: trigger,
            announcement_updates: announcementUpdates,
            private_post_updates: privatePostUpdates,
            public_post_updates: publicPostUpdates,
            status_changes: statusChanges
        });
    }

    static async getPreferences(userId) {
        return await this.model.findOne({
            where: {
                user_id: userId
            }
        });
    }

    static async getUsersWithPreferenceEnabled(preferenceType) {
        const query = {};
        query[preferenceType] = true;
        const preferences = await this.model.findAll({
            where: query,
            include: [{
                model: User.model,
                attributes: ['status', 'username']
            }]
        });
    
        const filteredPreferences = preferences.filter(preference => {
            const status = preference.user.status;
            const emailPreference = preference.email_notification_preference;
            return shouldSendEmailNotification(status, emailPreference);
        });
    
        return filteredPreferences.map(preference => ({
            user_id: preference.user_id,
            email: preference.email,
            username: preference.user.username
        }));
    }
}

function shouldSendEmailNotification(status, emailPreference) {
    switch (emailPreference) {
        case 'Ok':
            return true;
        case 'Help':
            return status === 'help' || status === 'emergency';
        case 'Emergency':
            return status === 'emergency';
        case 'off':
        default:
            return false;
    }
}
