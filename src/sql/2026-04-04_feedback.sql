DROP TABLE IF EXISTS feedback;
CREATE TABLE feedback (
	id          STRING PRIMARY KEY,
  formId      VARCHAR(20) NOT NULL,
	created     INTEGER NOT NULL,
	jsonData    TEXT NOT NULL,
  notes       TEXT
);