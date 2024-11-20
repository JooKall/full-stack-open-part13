CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('First Author', 'www.url.com', 'First title', 2);

insert into blogs (author, url, title) values ('Second Author', 'www.url.com', 'Second title');