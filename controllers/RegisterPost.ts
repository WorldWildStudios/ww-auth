import { Request, Response } from "express";
import { randomUUID } from 'crypto';
import { users } from '../models/entities/Database.js';
import Users from "../models/entities/Users.js";
import hash from "../structures/Hash.js";

export default async function(req: Request, res: Response) {
    const { username, password, email, phone, firstName, lastName, passwordConfirmation } = req.body;
    if(username.toLowerCase() == "never gonna give you up") {
        res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        return;
    }
    if (!username || !password || !email || !phone || !firstName || !lastName || !passwordConfirmation) {
        req.flash("danger", 'Missing fields');
        res.redirect('/register');
        return;
    }
    // Password must be between 8 and 64 characters and be the same as the confirmation
    if (password.length < 8 || password.length > 64) {
        req.flash("danger", 'Password must be between 8 and 64 characters');
        res.redirect('/register');
        return;
    }
    if (password !== passwordConfirmation) {
        req.flash("danger", 'Passwords does not match');
        res.redirect('/register');
        return;
    }
    // Username must be between 3 and 25 characters
    if (username.length < 3 || username.length > 25) {
        req.flash("danger", 'Username must be between 3 and 25 characters');
        res.redirect('/register');
        return;
    }
    // Email must be between 3 and 255 characters
    if (email.length < 3 || email.length > 255) {
        req.flash("danger", 'Email must be between 3 and 255 characters');
        res.redirect('/register');
        return;
    }
    // And be a correct email
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        req.flash("danger", 'Email is not valid');
        res.redirect('/register');
        return;
    }
    // Phone must be between 3 and 255 characters
    if (phone.length < 3 || phone.length > 255) {
        req.flash("danger", 'Phone must be between 3 and 255 characters');
        res.redirect('/register');
        return;
    }
    // And be a correct phone number
    if (!phone.match(/^[0-9]{10}$/)) {
        req.flash("danger", 'Phone is not valid');
        res.redirect('/register');
        return;
    }
    // First name must be between 3 and 25 characters
    if (firstName.length < 3 || firstName.length > 25) {
        req.flash("danger", 'First name must be between 3 and 25 characters');
        res.redirect('/register');
        return;
    }
    // Last name must be between 3 and 25 characters
    if (lastName.length < 3 || lastName.length > 25) {
        req.flash("danger", 'Last name must be between 3 and 25 characters');
        res.redirect('/register');
        return;
    }
    const queries = [{value: {username}, type: 'Username'}, {value: {phone}, type: "Phone"}, {value: {email}, type: "Email"}];
    for(const query of queries) {
        let queryied = await users.findOne({
            select: {
                id: true
            },
            where: query.value
        });
        if(queryied) {
            req.flash("danger", `${query.type} already exists.`);
            res.redirect('/register');
            return;
        }
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
    req.flash("success", 'You have successfuly created your account !');
    res.redirect('/register');
    return;
};