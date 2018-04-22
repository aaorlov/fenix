import moment = require('moment');

export default function(value = new Date()): number {
  return moment(value).unix();
}