import mysql from 'mysql';
import config from 'config';

export default class Db {

    constructor() {
        let conf = config.get('db');
        this.connection = mysql.createConnection(conf); 
    }

    /**
     * Creates sql tables
     */
    install() {
        this.connection.connect();
        let users = `
            CREATE TABLE IF NOT EXISTS sr_users (
                id      VARCHAR(10) NOT NULL,
                name    VARCHAR(100) NOT NULL,
                clan    VARCHAR(16),
                level   INT(2) NOT NULL,
                PRIMARY KEY (id)
            );
        `;
        let stats = `
            CREATE TABLE IF NOT EXISTS sr_stats (
                id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
                user_id     VARCHAR(10) NOT NULL,
                trophies    INT(4) NOT NULL,
                donations   INT(4) NOT NULL,
                timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
                PRIMARY KEY (id),
                INDEX user_id (user_id)
            );
        `;
        this.connection.query(users);
        this.connection.query(stats);
        this.connection.end();
    }

    saveUser(user) {
        this.connection.connect();
        
        let userQuery = `
            INSERT INTO sr_users (id, name , clan, level) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE id = ?;
        `;
        let userInserts = [user.id, user.name, user.clan, user.level, user.id];

        let statsQuery = `
            INSERT INTO sr_stats (user_id, trophies, donations)
            VALUES (?, ?, ?)
        `;
        let statsInserts = [user.id, user.trophies, user.donations];
        
        this.connection.query(mysql.format(userQuery, userInserts));
        this.connection.query(mysql.format(statsQuery, statsInserts));

        this.connection.end();
    }
}