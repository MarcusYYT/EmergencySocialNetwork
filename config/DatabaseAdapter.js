import MySQLDatabase from './MySQLDatabase.js';
import SQLiteDatabase from './SQLiteDatabase.js';
import {Announcement} from '../models/Announcement.model.js';
import {User} from "../models/User.model.js"
import {Post} from "../models/Post.model.js"
import {PrivatePost} from "../models/PrivatePost.model.js"
import {Status} from "../models/Status.model.js"
import {Thread} from "../models/Thread.model.js"


export default class DatabaseAdapter {
    static databases = {
        'default': new MySQLDatabase(),
        'test': null
    };

    static currentDatabase = 'default';

    static setTestDatabaseName(filename) {
        this.databases['test'] = new SQLiteDatabase(filename)
    }

    static setCurrentDatabase(databaseKey){
        this.currentDatabase = databaseKey;
    }

    static getDatabase() {
        return this.databases[this.currentDatabase].sequelize;
    }

    static async reinitializeModels() {
        User.initModel(this.getDatabase());
        Announcement.initModel(this.getDatabase());
        Post.initModel(this.getDatabase());
        PrivatePost.initModel(this.getDatabase());
        Status.initModel(this.getDatabase());
        Thread.initModel(this.getDatabase());

        await User.model.sync();
        await Announcement.model.sync();
        await Post.model.sync();
        await PrivatePost.model.sync();
        await Status.model.sync();
        await Thread.model.sync();
    }

    static switchDatabase(databaseKey) {
        this.currentDatabase = databaseKey;
    }

}