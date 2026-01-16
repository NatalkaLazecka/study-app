import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

vi.mock('../src/services/user.service.js', () => ({
    findUserByEmail: vi.fn(),
    createUser: vi.fn()
}));
vi.mock('../src/services/jwt.service.js', () => ({
    generateToken: vi.fn()
}));
vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn()
    }
}));
vi.mock('uuid', () => ({
    v4: () => 'MOCKED_UUID'
}));

import * as userService from '../src/services/user.service.js';
import * as authController from '../src/controllers/auth.controller.js';

describe('auth.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.clearAllMocks();

        req = {body: {}, user: {}};
        res = {
            status: vi.fn(function () {
                return this;
            }),
            json: vi.fn(function () {
                return this;
            }),
            cookie: vi.fn(),
            clearCookie: vi.fn()
        };
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('zwraca 400, gdy brakuje emaila lub hasła', async () => {
            req.body = {e_mail: '', haslo: ''};

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'Email and password fields are required'});
        });

        it('zwraca 400, jeśli użytkownik już istnieje', async () => {
            req.body = {e_mail: 'example@x.pl', haslo: 'xxx'};
            userService.findUserByEmail.mockResolvedValue({id: '1'});

            await authController.register(req, res);

            expect(userService.findUserByEmail).toHaveBeenCalledWith('example@x.pl');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'User already exists'});
        });

        it('tworzy nowego użytkownika jeśli nie istnieje', async () => {
            req.body = {e_mail: 'new@x.pl', haslo: 'pass', imie: 'Jan', nazwisko: 'Kowalski'};
            userService.findUserByEmail.mockResolvedValue(null);

            await authController.register(req, res);

            expect(userService.createUser).toHaveBeenCalledWith({
                id: 'MOCKED_UUID',
                e_mail: 'new@x.pl',
                haslo: 'pass',
                imie: 'Jan',
                nazwisko: 'Kowalski'
            });
            expect(res.json).toHaveBeenCalledWith({ok: true});
        });

        it('zwraca 500 gdy wystąpi błąd', async () => {
            req.body = {e_mail: 'new@x.pl', haslo: 'pass'};
            userService.findUserByEmail.mockRejectedValue(new Error('DB err'));
            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'Registration failed'});
        });
    });
});