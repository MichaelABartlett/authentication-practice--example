DROP TABLE IF EXISTS users;

create table users (
	id int not null auto_increment,
    username varchar(100) not null,
    password_hash varchar(10000) not null,
    role varchar(300),
    PRIMARY KEY(id)
    );
    
    INSERT INTO ingredients (ingredient, preptime, instruction) 
	values ('chicken', '24 hours', 'put frozen chicken in icebox and keep in sealed package');
    
select * from users;