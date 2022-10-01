import { Request, Response } from "express";
import { randomUUID } from 'crypto';
import { DB, users } from '../models/entities/Database.js';
import Users from "../models/entities/Users.js";
import hash from "../structures/Hash.js";

export default async function(req: Request, res: Response) {
    const { username, password, email, phone, firstName, lastName, passwordConfirmation } = req.body;
    if (!username || !password || !email || !phone || !firstName || !lastName || !passwordConfirmation) {
        res.status(400).json({
            error: 'Missing fields'
        });
        return;
    }
    // Password must be between 8 and 64 characters and be the same as the confirmation
    if (password.length < 8 || password.length > 64) {
        res.status(400).json({
            error: 'Password must be between 8 and 64 characters'
        });
        return;
    }
    if (password !== passwordConfirmation) {
        res.status(400).json({
            error: 'Passwords does not match'
        });
        return;
    }
    // Username must be between 3 and 25 characters
    if (username.length < 3 || username.length > 25) {
        res.status(400).json({
            error: 'Username must be between 3 and 25 characters'
        });
        return;
    }
    // Email must be between 3 and 255 characters
    if (email.length < 3 || email.length > 255) {
        res.status(400).json({
            error: 'Email must be between 3 and 255 characters'
        });
        return;
    }
    // And be a correct email
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        res.status(400).json({
            error: 'Email is not valid'
        });
        return;
    }
    // Phone must be between 3 and 255 characters
    if (phone.length < 3 || phone.length > 255) {
        res.status(400).json({
            error: 'Phone must be between 3 and 255 characters'
        });
        return;
    }
    // And be a correct phone number
    if (!phone.match(/^[0-9]{10}$/)) {
        res.status(400).json({
            error: 'Phone is not valid'
        });
        return;
    }
    // First name must be between 3 and 25 characters
    if (firstName.length < 3 || firstName.length > 25) {
        res.status(400).json({
            error: 'First name must be between 3 and 25 characters'
        });
        return;
    }
    // Last name must be between 3 and 25 characters
    if (lastName.length < 3 || lastName.length > 25) {
        res.status(400).json({
            error: 'Last name must be between 3 and 25 characters'
        });
        return;
    }
    const user = await users.findOne({
        where: {
            username
        }
    });
    if (user) {
        res.status(400).json({
            error: 'Username already exists'
        });
        return;
    }
    const hashPassword = hash(password);
    const newUser = new Users();
    newUser.username = username;
    newUser.password = hashPassword;
    newUser.email = email;
    newUser.phone = phone;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.avatarUUID = randomUUID();
    await users.save(newUser);
    res.status(200).json({
        success: true
    });
};