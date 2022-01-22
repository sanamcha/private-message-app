/** User class for message.ly */
const bcrypt = require("bcrypt");
const db = require("../db");
const ExpressError = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({username, password, first_name, last_name, phone}) { 
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users(username, password, first_name, last_name, phone, join_at)
      VALUES($1, $2, $3, $4, $5, current_timestamp)`,
      [username, hashedPw, first_name, last_name, phone]
    );
    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      'SELECT password FROM users WHERE username = $1',[username]);
    const user = result.rows[0];

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return true;
      }
    }
    return false;
  }
   

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users SET last_login_at = current_timestamp WHERE username = $1
      RETURNING username, last_login_at`,[username]);
    if (!result.rows[0]) {
      throw new ExpressError(`No such username ${username} found`, 404);
    }
    return result.rows[0];
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at 
       FROM users`);
    return result.rows;
   }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at 
      FROM users WHERE username = $1`, [username]);

    if (!results.rows[0]) {
        throw new ExpressError(`No such username found: ${username}`, 404);
      }
    return results.rows[0];
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT messages.id, users.to_username, users.first_name, users.last_name, users.phone, messages.body, messages.sent_at, messages.read_at 
      FROM messages
      JOIN users ON messages.to_username = users.username
      WHERE from_username = $1`,[username]);
    if (!results.rows[0]) {
      throw new ExpressError(`No messages found from ${username}`);
    }

    let messages = [];
    let x = results.rows;

    for (let i = 0; i < x.length; i++) {
     
      messages.push({
        id: x[i].id,
        to_user: {
          username: x[i].to_username,
          first_name: x[i].first_name,
          last_name: x[i].last_name,
          phone: x[i].phone
        },
        body: x[i].body,
        sent_at: x[i].sent_at,
        read_at: x[i].read_at
      });
    }
    return messages;
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(
      `SELECT messages.id, messages.from_username, messages.first_name, users.last_name, users.phone, messages.body, messages.sent_at, messages.read_at 
      FROM messages
      JOIN users ON messages.from_username = users.username
      WHERE to_username = $1`,[username]);

    if (!results.rows[0]) {
      throw new ExpressError(`No messages found to ${username}`);
    }

    let messages = [];
    let x = results.rows;

    for (let i = 0; i < x.length; i++) {
      messages.push({
        id: x[i].id,
        from_user: {
          username: x[i].from_username,
          first_name: x[i].first_name,
          last_name: x[i].last_name,
          phone: x[i].phone
        },
        body: x[i].body,
        sent_at: x[i].sent_at,
        read_at: x[i].read_at
      });
    }
    return messages;
  }
   
}


module.exports = User;