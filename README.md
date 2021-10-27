# MongoDB Migration

## Overview

Contains two scripts, `asyncLoader` and `asyncDeleter`, for loading to and deleting from the MongoDB instance respectively. Also contains basic controllers for use in the main application.

`Responses` is not yet implemented.

## Structure

```
├── index.js            --> Entry point of loader / deleter scripts
├── asyncDeleter.js
├── asyncLoader.js
├── asyncProducts.js
├── controllers         --> Basic controllers, to be reused in the main application
│   ├── queries         --> Deep Load for Customer Object
│   └── retrievers      --> Retrievers per model, with option for backwards compatibility
├── data                --> Input folder with required offline JSON files
│   ├── products.json   --> Legacy file, refactor to contain _skuObjectID before loading
│   └── skus.json       --> Legacy file, does not need to be refactored before loading
├── loaders             --> MySQL and JSON loaders to MongoDB
│   ├── independent     --> Top level loaders
│   └── dependent       --> Nested, dependent loaders
├── models
│   ├── mongodb         --> Mongoose models, to be reused in the main application
│   └── mysql
└── utils
│   └── getJSON.js
│   └── asyncLoader.js
├── .env                --> Critical environment variables
├── products-mongo.json --> Output products.json for embedding offline in main app
├── skus-mongo.json     --> Output skus.json for embedding offline in main app
├── products.env        --> Output environment variables for use in main application
└── skus.env            --> Output environment variables for use in main application
```

## CLI Usage

### Environment Variables

Prior to usage, modify `.env` with the appropriate MongoDB connection string and MySQL connection information. Note, `APP_VERSION_NUMBER` is not entirely necessary, as it is only used in the `controllers` and not the `loaders`, but ensure it is defined if running `controllers`.

- NODE_ENV
- MONGO_URI
- MYSQL_URI
- MYSQL_DB
- MYSQL_PW
- MYSQL_UN
- MYSQL_HOST
- MYSQL_PORT
- MYSQL_DIALECT
- APP_VERSION_NUMBER

### Change Directory

```
cd ./path/to/root
```

### Loader

#### **1. Batch Loader**

Batch-loads all MySQL and JSON data into MongoDB in parallel and series depending on interdependent fields and ObjectID references. `./skus.env` and `./skus-mongo.json` files will be written to preserve the ObjectID of the `fs.files` `skus.json` file and the dumped `SKU` collection (for retrieving ObjectIDs). Does not load `./data/products.json` as this file needs to be refactored with `_skuObjectID` fields.

```
node index.js
```

#### **2. Product Loader**

Assuming that `./data/products.json` has been refactored with `_skuObjectID` fields from `./skus-mongo.json`, loads `./data/products.json` into MongoDB and then writes `./products.env` and `./products-mongo.json` exports to preserve the ObjectID of the `fs.files` `products.json` file and exported JSON file for offline loading.

```
node index.js -p
```

### Deleter

Deletes all records from all MongoDB collections in parallel.

```
node index.js -d
```

## Usage in Main Application

**Highlights**

Migrate `controllers` and `models/mongodb` to the main application.

**Models**

Note that `models/mongodb/index.js` re-exports the `conn` (connection) to MongoDB, as well as `mongoose` models for each MongoDB collection, including `GridFSFiles` and `GridFSChunks`.

- The GridFS feature of MongoDB is via the [gridfile](https://www.npmjs.com/package/gridfile) package. It has low usage compared to `gridfs-stream`, but is efficient and `gridfs-stream` is not compatible with the latest versions of `mongoose`.
- Because of `gridfile`, uploading and retrieving files is via the `GridFSFiles` model. If deletion or other operations directly on the `fs.chunks` collection is necessary, use `GridFSChunks`.
- Files need not be retrieved from `GridFSFiles` (i.e. `fs.files`) directly, but can be queried from `VFS` and deep-loaded. The exception is `skus.json` and `products.json`, which need to be queried directly as they don't possess all the standard `VFS` metadata.

```javascript
const { Customer, VFS, GridFSFiles } = require("./models/mongodb");

const customers = await Customer.find({}).lean();
```

**Controllers**

- `queries` contains a `deepLoadCustomer` function and a `getCustomer` function.
  - `deepLoadCustomer` takes in a customer **Object** and deep-loads any associated metadata. It does NOT ensure backward compatibility with MySQL.
  - `getCustomer` takes in a variety of search parameters and attempts to find a customer using them. It is a shallow load.
- `retrievers` contains basic `mongoose` queries that act as `SELECT * FROM <model>`.
  - A few functions, where applicable, take in a boolean `backwardsCompatibility` flag (default `false`) to inject additional fields to the model response that would ensure the record(s) returned are backwards-compatible with legacy `Sequelize` or MySQL code.
  - The exception to this is for `id`; the MySQL `id` is deprecated and instead referred to as `_mysqlId`, and `_id` is used for the MongoDB identifier.
