import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  mysql: {
    host: process.env.MYSQL_HOST || "mysql",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER || "app",
    password: process.env.MYSQL_PASSWORD || "app",
    database: process.env.MYSQL_DATABASE || "ecom",
  },
  elastic: {
    node: process.env.ELASTIC_NODE || "http://elasticsearch:9200",
    username: process.env.ELASTIC_USERNAME || "elastic",
    password: process.env.ELASTIC_PASSWORD || "changeme",
    index: process.env.ELASTIC_INDEX || "products",
  },
};
