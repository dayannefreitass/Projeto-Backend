const request = require('supertest');
const app = require('../src/app');

describe('GET /api/users', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
    });

    it('should return 404 Not Found for a non-existing user', async () => {
        const response = await request(app).get('/api/users/999');
        expect(response.status).toBe(404);
    });
});
