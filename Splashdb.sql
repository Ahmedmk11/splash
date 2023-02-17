USE Splash;

DROP PROCEDURE IF EXISTS dropAllTables;
DELIMITER $$
CREATE PROCEDURE dropAllTables()
BEGIN
	DROP TABLE IF EXISTS Recommendations;
    DROP TABLE IF EXISTS OrderProducts;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Carts;
    DROP TABLE IF EXISTS Favorites;
    DROP TABLE IF EXISTS Users;
    DROP TABLE IF EXISTS Products;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS createAllTables;
DELIMITER $$
CREATE PROCEDURE createAllTables()
BEGIN
	CREATE TABLE IF NOT EXISTS Products
	(
		product_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		product_code varchar(4) NOT NULL,
		product_title varchar(64) NOT NULL,
		product_price decimal(13,2) NOT NULL,
		product_dimensions varchar(20) NOT NULL,
		product_description varchar(256) NOT NULL,
		product_type varchar(20) NOT NULL,
		PRIMARY KEY (product_id)
	);
	CREATE TABLE IF NOT EXISTS Users
	(
		user_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		user_fullname varchar(100) NOT NULL,
		user_uname varchar(32) NOT NULL UNIQUE,
		user_password varchar(60) NOT NULL,
		user_email varchar(320) NOT NULL UNIQUE,
		user_phone varchar(15) NOT NULL UNIQUE,
		user_date_joined datetime NOT NULL,
		PRIMARY KEY (user_id)
	);
    CREATE TABLE IF NOT EXISTS Orders
	(
		order_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		order_date datetime NOT NULL,
        order_userid int UNSIGNED NOT NULL,
        FOREIGN KEY(order_userid) REFERENCES Users(user_id) ON UPDATE CASCADE,
		PRIMARY KEY (order_id)
	);
    CREATE TABLE IF NOT EXISTS Recommendations
	(
		recommendation_id int UNSIGNED,
		FOREIGN KEY(recommendation_id) REFERENCES Products(product_id),
        PRIMARY KEY (recommendation_id)
	);
	CREATE TABLE IF NOT EXISTS Carts
	(
		cart_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		cart_userid int UNSIGNED,
        cart_productid int UNSIGNED,
		FOREIGN KEY(cart_userid) REFERENCES Users(user_id),
        FOREIGN KEY(cart_productid) REFERENCES Products(product_id),
        PRIMARY KEY (cart_id)
	);
	CREATE TABLE IF NOT EXISTS Favorites
	(
		favorite_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		favorite_userid int UNSIGNED,
        favorite_productid int UNSIGNED,
		FOREIGN KEY(favorite_userid) REFERENCES Users(user_id),
        FOREIGN KEY(favorite_productid) REFERENCES Products(product_id),
        PRIMARY KEY (favorite_id)
	);
	CREATE TABLE IF NOT EXISTS OrderProducts
	(
		orderproduct_id int UNSIGNED NOT NULL AUTO_INCREMENT,
		orderproduct_orderid int UNSIGNED,
        orderproduct_productid int UNSIGNED,
		FOREIGN KEY(orderproduct_orderid) REFERENCES Orders(order_id),
        FOREIGN KEY(orderproduct_productid) REFERENCES Products(product_id),
        PRIMARY KEY (orderproduct_id)
	);
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getUserOrders;
DELIMITER $$
CREATE PROCEDURE getUserOrders (userid int)
BEGIN
	SELECT order_id FROM Orders o 
    INNER JOIN Users u
	ON o.order_userid = u.user_id
	WHERE u.user_id = userid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getOrderItems;
DELIMITER $$
CREATE PROCEDURE getOrderItems (orderid int) 
BEGIN 
	SELECT orderproduct_productid FROM OrderProducts op
	WHERE op.orderproduct_orderid = orderid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getOrderPrice;
DELIMITER $$
CREATE PROCEDURE getOrderPrice (orderid int) 
BEGIN
	SELECT sum(product_price) FROM Products p
    INNER JOIN OrderProducts op
    ON p.product_id = op.orderproduct_productid
    WHERE op.orderproduct_orderid = orderid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS getCartTotal;
DELIMITER $$
CREATE PROCEDURE getCartTotal (userid int)
BEGIN
	SELECT sum(product_price) FROM Products p
    INNER JOIN Carts c
    ON p.product_id = c.cart_productid
    WHERE c.cart_userid = userid;
END $$
DELIMITER ;

CREATE VIEW viewmasterbedrooms
AS
	SELECT * FROM Products p
	WHERE p.product_type = 'masterbedroom';

CREATE VIEW viewkidsbedrooms
AS
	SELECT * FROM Products p
	WHERE p.product_type = 'kidsbedroom';

-- ------------------------------ --

INSERT INTO Users (user_fullname, user_uname, user_password, user_email, user_phone, user_date_joined) 
VALUES
('Ahmed M', 'ahmedmk11', '123', 'ahmed@hotmail.com', '01550800848', now()),
('Sama T', 'samaeltobgy','456', 'sama@hotmail.com', '12345678910', now()),
('Guest G', 'guest11', '789', 'guest@hotmail.com', '00000000000', now());

INSERT INTO Products (product_code, product_title, product_price, product_dimensions, product_description, product_type) 
VALUES 
('M01', 'Spiderman Bedroom', 200000.00, '10x8x3', 'Good Bedroom', 'kidsbedroom'),
('M01', 'Mr.Herbert Basement', 5000.00, '3x3x3', 'Bad Bedroom', 'kidsbedroom'),
('M02', 'Batman Bedroom', 300000.00, '10x8x3', 'Good Bedroom', 'masterbedroom'),
('M03', 'Modern Livingroom', 500000.00, '14x10x5', 'Good Livingroom', 'livingroom');

INSERT INTO Orders (order_date, order_userid) 
VALUES 
('2021-1-1 13:17:17', 1),
('2022-1-2 13:17:17', 1),
('2023-1-3 13:17:17', 1),
('2023-2-1 13:17:17', 2),
('2023-2-2 13:17:17', 2);

INSERT INTO OrderProducts (orderproduct_orderid, orderproduct_productid) 
VALUES 
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 3);

INSERT INTO Carts (cart_userid, cart_productid) 
VALUES 
(3, 1),
(3, 2),
(3, 3);

SELECT * FROM Products;
SELECT * FROM Users;
SELECT * FROM Orders;
SELECT * FROM OrderProducts;

CALL createAllTables();
CALL dropAllTables();
CALL getUserOrders(1);
CALL getOrderItems(1);
CALL getOrderPrice(1);
CALL getCartTotal(3);

-- ------------------------------ --
