CREATE TABLE lied(

    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    versicle VARCHAR(500),
    img VARCHAR,
    mp3 VARCHAR,
    created_at DATE DEFAULT CURRENT_DATA,
    etappe VARCHAR(20),
    favorite BOOLEAN,
    kommentare: text[],
    liedText: VARCHAR,
)



CREATE TABLE kommentare(

    id serial PRIMARY KEY,
    id_lied INTEGER,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    description VARCHAR NOT NULL,
    FOREIGN KEY (id_lied) REFERENCES lied(id)
)