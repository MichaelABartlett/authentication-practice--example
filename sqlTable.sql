DROP TABLE IF EXISTS users;

create table users (
	id int not null auto_increment,
    username varchar(100) not null,
    password_hash varchar(10000) not null,
    role varchar(300),
    PRIMARY KEY(id)
    );
    
    INSERT INTO users (username, password_hash, role) 
	values ('codeman', '$2b$10$H1EX3rxRpsuhapDj2a5Vh.ncu7of1boNlNt.9rlJ7Afgr6qwNLYH6', 'admin');
    
select * from users;

update users set role = 'admin' where id = 1;


