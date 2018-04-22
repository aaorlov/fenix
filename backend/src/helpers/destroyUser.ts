import User from '../api/user/model';

export default function(userId, callback): void {
  User.destroy(userId, callback);
}