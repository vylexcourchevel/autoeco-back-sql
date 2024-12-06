import jwt from 'jsonwebtoken';
import { verifyToken, verifyRole } from '../middleware/auth'; // Adjust the path as needed
import { createError } from '../error.js';
import { jest } from "@jest/globals"
jest.mock('jsonwebtoken'); // Mock jsonwebtoken
jest.mock('../error.js'); // Mock error handling

describe('Auth Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {},
            headers: {},
        };
        res = {};
        next = jest.fn(); // Mock the next function
    });

    describe('verifyToken', () => {
        test('should call next with an error if no token is provided', () => {
            verifyToken(req, res, next);
            expect(next).toHaveBeenCalledWith(createError(401, "Accès refusé, token manquant"));
        });
    });

    describe('verifyRole', () => {
        test('should call next if user role matches', () => {
            req.user = { role: 'admin' }; // Mock user role
            const roleToCheck = 'admin';

            verifyRole(roleToCheck)(req, res, next);
            expect(next).toHaveBeenCalled(); // Ensure next() was called
        });
    });
});
