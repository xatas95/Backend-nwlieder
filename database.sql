CREATE TABLE lied(

    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    img VARCHAR,
    audios VARCHAR[],
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    etappe VARCHAR(20),
    favorite BOOLEAN,
    liedText VARCHAR
)



CREATE TABLE kommentare(

    id serial PRIMARY KEY,
    id_lied INTEGER,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    description VARCHAR NOT NULL,
    audio_id VARCHAR NOT NULL,
    FOREIGN KEY (id_lied) REFERENCES lied(id)
    
)