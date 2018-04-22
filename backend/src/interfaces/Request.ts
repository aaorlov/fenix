import express = require('express');

export default interface Request extends express.Request {
  body: any
}