SRCrawler
==================
Crawls statsroyale.com and grabs player information

Installation
------------------
1. Download or checkout git repo.
2. Run npm install
3. Add mysql config to config/production.json
4. chmod +x run.sh
5. Create `/etc/systemd/system/srcrawler.service` to add in systemd (path may vary):
```
[Unit]
Description=SRCrawler node app

[Service]
ExecStart=/path/to/srcrawler/run.sh
Restart=always
User=srcrawler-user #use appropriate user here
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/path/to/srcrawler/
KillMode=process

[Install]
WantedBy=multi-user.target
```
6. Run `systemctl enable srcrawler` and `systemctl start srcrawler`.
7. Verify its running with `systemctl stats srcrawler`.
