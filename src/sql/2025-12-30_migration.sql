DROP TABLE IF EXISTS events_migration;
CREATE TABLE IF NOT EXISTS events_migration (
  id          STRING PRIMARY KEY,
  `state`     INTEGER NOT NULL, -- 0=draft, 1=published, 2=archived
  titleDe     TEXT NOT NULL,
  titleEn     TEXT,
  descDe      TEXT NOT NULL,
  descEn      TEXT,
  website     TEXT,
  pictureUrl  TEXT,
  submName    TEXT NOT NULL,
  submEmail   TEXT NOT NULL,
  orgaName    TEXT,
  orgaPhone   TEXT,
  orgaEmail   TEXT,
  orgaWebsite TEXT,
  orgaNotes   TEXT,
  rngStart    INTEGER NOT NULL,
  rngEnd      INTEGER NOT NULL,
  `times`     TEXT NOT NULL, -- json
  place       TEXT NOT NULL, -- json
  tags        TEXT NOT NULL, -- json
  decoration  TEXT           -- json
);
CREATE INDEX events_rngStart ON events_migration (rngStart);
CREATE INDEX events_rngEnd   ON events_migration (rngEnd);

INSERT INTO events_migration SELECT
  id,
  isPublished                        AS `state`,
  jsonData ->> '$.title'             AS titleDe,
  null                               AS titleEn,
  jsonData ->> '$.descHtml'          AS descDe,
  null                               AS descEn,
  jsonData ->> '$.website'           AS website,
  jsonData ->> '$.pictureUrl'        AS pictureUrl,
  jsonData ->> '$.submitter.name'    AS submName,
  jsonData ->> '$.submitter.email'   AS submEmail,
  jsonData ->> '$.organizer.name'    AS orgaName,
  jsonData ->> '$.organizer.phone'   AS orgaPhone,
  jsonData ->> '$.organizer.email'   AS orgaEmail,
  jsonData ->> '$.organizer.website' AS orgaWebsite,
  jsonData ->> '$.orgaNotes'         AS orgaNotes,
  0                                  AS rngStart,
  0                                  AS rngEnd,
  jsonData ->  '$.time'              AS `times`,
  jsonData ->  '$.place'             AS place,
  jsonData ->  '$.tags'              AS tags,
  jsonData ->  '$.decoration'        AS decoration
FROM events;

-- DROP TABLE events;
-- ALTER TABLE events_migration RENAME TO events;
