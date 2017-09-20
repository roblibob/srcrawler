import Crawler from "crawler";
import request from "request";
import config from "config";
import format from "string-format";
import User from "./User";
import Db from "./Db";

//Install db tables
let db = new Db();
db.install();

//Load config
format.extend(String.prototype);
let endpoints = config.get("endpoints");
let clans = config.get("clans");

//Set up clan endpoints
let clanTasks = [];
clans.forEach(function (clan) {
    clanTasks.push(endpoints.clan.format(endpoints.baseUrl, clan.id));
});

/**
 * Crawls a clanpage and parses the players
 */
let clanCrawler = new Crawler({
    maxConnections: 1,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            let clanString = "";
            let count = 0;
            $(".clan__rowContainer").each(function (i, el) {
                if ($(el).children().length === 7) {
                    let id = $(el).children().eq(1).children().first().attr("href").replace("/profile/", "");
                    let name = $(el).children().eq(1).text().trim();
                    let clan = $(".clan__clanName").text().trim();
                    let level = $(el).children().eq(2).text().trim();
                    let trophies = $(el).children().eq(4).text().trim();
                    let donations = $(el).children().eq(5).text().trim();
                    let role = $(el).children().eq(6).text().trim();
                    let user = new User(id, name, clan, level, trophies, donations, role);
                    console.log(id, name, clan, level, trophies, donations, role);
                    clanString = clan;
                    count++;
                    user.save();
                }
            });

            console.log(clanString + " parsed. (" + count + ") saved.");
        }
        done();
    }
});

/**
 * Refreshes an url and start the crawler
 * @param string url
 */
function refresh (url) {
    request.get(url + "/refresh", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let data = JSON.parse(body);
            if (data.success) {
                //Update after secondsToUpdate and ley room
                console.log("Url: " + url + " refreshed. Updating in " + (data.secondsToUpdate + 5) + " seconds.");
                setTimeout(function () { 
                    clanCrawler.queue(url);
                }, (data.secondsToUpdate + 5) * 1000);
            } else {
                console.log("URL: " + url + " is already updated.");
                clanCrawler.queue(url);
            }
        } else {
            console.log("Error:" + error);
            console.log("Response:" + response.statusCode);
        }
    });
}

//Times each of the clan tasks
for (let task of clanTasks) {
    refresh(task);
    setInterval(refresh, 1000 * 60 * 60 * 2.5, task);
}

