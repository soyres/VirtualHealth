import request from 'supertest';
import app from '../app.js'; // Assuming this imports the app correctly
let server;

beforeAll(done => {
  // Set the environment for testing
  process.env.PORT = 5001;  // Ensure the test server runs on port 5001
  process.env.NODE_ENV = 'test'; // Ensure the app recognizes it's in test mode

  server = app.listen(process.env.PORT, () => {
    console.log("Test server running on port 5001");
    done();  // Ensure Jest knows when the server is ready before starting tests
  });
});

afterAll(done => {
  // Ensure the server closes after all tests
  server.close(done);
});

describe('User API', () => {
  const generateUniqueEmail = () => `user${Date.now()}@example.com`;

  describe('POST /api/users/register', () => {
    it('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: '',  // Invalid name (empty)
          email: 'invalid-email',  // Invalid email format
          password: '123'  // Password too short
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'John Doe',
          email: generateUniqueEmail(),  // Unique email
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully!');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.name).toBe('John Doe');
    });

    it('should return 400 if email already exists', async () => {
      const email = generateUniqueEmail();

      // First register a user with the unique email
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Jane Doe',
          email: email,
          password: 'password123',
        });

      // Attempt to register with the same email again
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'John Doe',
          email: email,  // Duplicate email
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email must be unique');
    });
  });
});
