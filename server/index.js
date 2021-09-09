require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');
const ClientError = require('./client-error');
// const argon2 = require('argon2');
// const jwt = require('jsonwebtoken');
// const ClientError = require('./client-error');
const jsonMiddleware = express.json();
// const uploadsMiddleware = require('./uploads-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(jsonMiddleware);

app.use(staticMiddleware);

app.use(errorMiddleware);

app.post('/api/home', (req, res, next) => {
  const { userId } = req.user;
  const { title, category, price, description, location } = req.body;
  if (!title || !category || typeof price !== 'number') {
    throw new ClientError(400, 'title (string), category (string), and price (number) are required fields');
  }
  const sql = `
    insert into "posts" ("userId", "title", "category", "price", "description", "location")
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `;
  const params = [userId, title, category, price, description, location];
  db.query(sql, params)
    .then(result => {
      const [newPost] = result.rows;
      res.status(201).json(newPost);
    })
    .catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
