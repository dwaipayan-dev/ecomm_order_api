# ecomm_order_api

### Note: I have not been to deploy the project on AWS/HEROKU due to dependency blocker. It requires a credit card which none of my family members use. If you want to test the server please run it locally.

### Requirements:

1. Node
2. NPM
3. Postgres
4. Postman

### Usage:

1. Please setup a user with read/write priveleges and a db with the name 'ecommdb' on postgres. Restore the dump file given in the repo into this database.
2. After pulling the repository and executing 'npm install', Run the command 'npm run start' on terminal at root project folder to start the project.

### EndPoints:

#### Authentication Controller

1. POST "/auth/signup": takes body with fields name, email and password to create a user in db.

2. POST "/auth/login": takes body with fields email and password to authenticate the user and return authorization jwt token and user name. Use this token in all the other calls as they are protected endpoints that require authentication/authorization

#### Order Controller

1. POST "/order/add/product/:productId": takes body with fields orderId and uses the path parameter productId to add the product in the order. Deleting the product from order is not implemented as it was outside the scope of task.

2. POST "/order/place": takes body with fields orderId to place the order and change it's status from INCOMPLETE(indicating cart) to COMPLETE(indicating placed order.

3. GET "/order/get/cart": gets new/existing cartId of currently logged in user.

4. GET "/order/fetch/cart": fetch cart details of currently logged in user, identified via jwt token

5. GET "/order/fetch/orders": fetch order history of currently logged in user, identified via jwt token

#### Product Controller

1. GET "/product/find/total": Get total count of all products in product table.

2. GET "/product/get/:pageNumber": Gets all product paginated by pageNumber path parameter. productPerPage is a const object in product controller class that by default is 12. Can be changed accodingly in code.



