import Db from "./Db";

export default class User {
    constructor(id, name, clan, level, trophies, donations, role) {
        this.id = id;
        this.name = name;
        this.clan = clan;
        this.level = level;
        this.trophies = trophies;
        this.donations = donations;
        this.role = role;
    }

    save() {
        new Db().saveUser(this);
    }
}