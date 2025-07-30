import { email, minLength, object, pipe, string } from "valibot";
import type { InferInput } from "valibot";
import { compare, hash } from "bcrypt";

/**
 * Schema for validating email addresses using valibot.
 */
const emailSchema = pipe(string(), email());
/**
 * Schema for validating passwords with a minimum length of 6 characters.
 */
const passwordSchema = pipe(string(), minLength(6));

/**
 * Authentication schema for users, requires valid email and password.
 */
export const authSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Enum for available user roles.
 */
export enum Role {
  "ADMIN" = "admin",
  "USER" = "user",
}

/**
 * Type representing a user, based on the authentication schema with additional fields.
 */
export type User = InferInput<typeof authSchema> & {
  id: number;
  role: Role;
  refreshToken?: string;
};

/**
 * Stores users in memory using a Map, where the key is the user's email.
 */
const users: Map<string, User> = new Map();

/**
 *
 * Creates a new user with the given email and password
 * The password is hashed before storing
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<User>} - The created user
 *
 */

export const createUser = async (
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await hash(password, 10);

  const newUser: User = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role: Role.USER,
  };

  users.set(email,  newUser); 

  return newUser;
};

/**
 *
 * Finds a user by their given email.
 *
 * @param {string} email - The email of the user to find.
 * @return {user | undefined} - The user if found, otherwise undefined.
 *
 */

export const findUserByEmail = (email: string): User | undefined => {
  return users.get(email);
};



/**
 * 
 * Validates a user's password
 * 
 * @param {user} user - The user whose password is to be validated.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} - True if the password is valid, otherwise false.
 * 
 */


export const validatePassword = async(
  user : User, 
  password : string
): Promise<boolean> => {
  return compare(password, user.password)
 }


 /**
  * Revoke Token
  * 
  * @param {string} email - The email of th user to revoke the token.
  * @return {boolean}
  */

 export const revokeUserToken = (email: string) : boolean => {
  const foundUser = users.get(email);

  if(!foundUser){
    return false;
  }

  users.set(email, {...foundUser, refreshToken: undefined})
  return true;
 }