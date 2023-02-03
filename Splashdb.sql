USE Splash;
SELECT * FROM test;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SAam$*lA<3';
-- flush privileges;

CREATE TABLE Product
(
    product_id INT PRIMARY KEY IDENTITY,
    product_title VARCHAR(64),
    product_price MONEY,
    product_dimension VARCHAR(20),
    product_description VARCHAR(256)
);

CREATE TABLE Users 
(

);
