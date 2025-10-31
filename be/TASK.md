# Build a simple e-commerce rest api 

You are required to build a basic e-commerce api with the followings

1. Use Node.js (express v5), ElasticSearch v8 and MySQL v8 using https://dummyjson.com/products as dummy data
2. Docker setup for webserver, elasticsearch and mysql.
   - It should run out of the box, so basically do "docker compose up" and all services are running. 
   - A user should be able to test without installing anything, besides Docker.
3. A seed db script to fetch data and populate in database
   - Fetch data from https://dummyjson.com/products and insert into database
   - Please create a proper schema for the data in MySQL
4. Index the data into ElasticSearch
   - Please create proper ES schema for the data, the indexing be combined with above script

5. Simple rest api with following endpoints
   - /categories       to list all categories ( from DB or ES )
   - /products         to list all products and support for filters ( from DB or ES )
   - /products/aggs       (faceting on meaningful fields )
   - /products/{id}     get a single product by id
