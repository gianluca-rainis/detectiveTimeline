# Detective Timeline
A timeline for detective

## Logo
<img src="./images/logo.png" />

## Main Page
<img src="./images/workingPage.png" />

Made for Midnight 2026!

## Database
### Accounts
```SQL
+-----------------------+
|       accounts        |
+-----------------------+
| id | email | password |
+----+-------+----------+
|    |       |          |
|    |       |          |
|    |       |          |
+----+-------+----------+
```

```SQL
CREATE TABLE accounts (
    id int NOT NULL AUTO_INCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    PRIMARY KEY (id)
);
```