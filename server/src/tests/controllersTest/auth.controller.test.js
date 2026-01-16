import { jest } from '@jest/globals';

jest.unstable_mockModule('../../services/user.service.js', () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  findUserById: jest.fn(),
}));

let register, userService;

beforeAll(async () => {
  userService = await import('../../services/user.service.js');
  ({ register } = await import('../../controllers/auth.controller.js'));
});

describe('register controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { e_mail: 'test@test.com', haslo: 'haslo123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    userService.findUserByEmail.mockReset();
    userService.createUser.mockReset();
    userService.findUserById.mockReset();
  });

  test('should reject if email or password missing', async () => {
    req.body = {};
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password fields are required' });
  });

  test('should reject if user already exists', async () => {
    userService.findUserByEmail.mockResolvedValue({ id: 'abc', e_mail: 'test@test.com' });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  test('should create user when email not taken', async () => {
    userService.findUserByEmail.mockResolvedValue(null);
    userService.createUser.mockResolvedValue({});
    await register(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test('should handle server error', async () => {
    userService.findUserByEmail.mockImplementation(() => {
      throw new Error('fail');
    });
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
  });
});