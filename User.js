import Db from "./Db";

export default class User {
    constructor(id, name, clan, level, trophies, donations) {
        this.id = id;
        this.name = name;
        this.clan = clan;
        this.level = level;
        this.trophies = trophies;
        this.donations = donations;
    }

    save() {
        new Db().saveUser(this);
        console.log("User " + this.id + " saved");
    }
}