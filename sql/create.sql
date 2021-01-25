create database if not exists food_db;
use food_db;
create user 'caloriebuddy' IDENTIFIED BY 's3cr3t';
grant all privileges on food_db.* TO 'caloriebuddy';
flush privileges;

create table if not exists foods (
    id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    serving_size FLOAT,
    serving_size_units VARCHAR(255) NOT NULL,
    calories FLOAT,
    carbs FLOAT,
    fat FLOAT,
    protein FLOAT,
    salt FLOAT,
    sugar FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

insert into foods (name, serving_size, serving_size_units, calories, carbs, fat, protein, salt, sugar) VALUES (
    'flour',
    100,
    'grams',
    381,
    81,
    1.4,
    9.1,
    0.01,
    0.6
);