import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  // 1. Tambahkan konfigurasi keamanan JWT di sini
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Masukkan token JWT dengan format: Bearer <token>'
    }
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    // 2. Tambahkan input khusus untuk Register dan Login
    RegisterInput: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'Budi' },
        email: { type: 'string', example: 'budi@example.com' },
        password: { type: 'string', example: 'rahasia123' },
      },
    },
    LoginInput: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'budi@example.com' },
        password: { type: 'string', example: 'rahasia123' },
      },
    },
    // Definisi bawaan Anda sebelumnya
    StallInput: {
      type: 'object',
      required: ['ownerId', 'name'],
      properties: {
        ownerId: { type: 'integer', example: 2 },
        name: { type: 'string', example: 'Warung Baru' },
        category: { type: 'string', example: 'Nasi' },
        location: { type: 'string', example: 'Kantin FK' },
        description: { type: 'string' },
      },
    },
    UserInput: {
      type: 'object',
      required: ['name', 'email', 'passwordHash', 'role'],
      properties: {
        name: { type: 'string', example: 'Budi' },
        email: { type: 'string', example: 'budi@example.com' },
        passwordHash: { type: 'string', example: 'hashed-password' },
        role: { type: 'string', enum: ['admin', 'owner', 'customer'], example: 'customer' },
      },
    },
    MenuItemInput: {
      type: 'object',
      required: ['stallId', 'name', 'price', 'isAvailable'],
      properties: {
        stallId: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Nasi goreng' },
        price: { type: 'integer', example: 15000 },
        isAvailable: { type: 'boolean', example: true },
      },
    },
    ReviewInput: {
      type: 'object',
      required: ['stallId', 'userId', 'rating'],
      properties: {
        stallId: { type: 'integer', example: 1 },
        userId: { type: 'integer', example: 1 },
        rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
        comment: { type: 'string', example: 'Enak dan cepat!' },
      },
    },
    LikeInput: {
      type: 'object',
      required: ['reviewId', 'userId'],
      properties: {
        reviewId: { type: 'integer', example: 1 },
        userId: { type: 'integer', example: 1 },
      },
    },
    FlagStatusInput: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', example: 'resolved' },
      },
    },
    AuditInput: {
      type: 'object',
      required: ['userId', 'action', 'targetTable', 'targetId'],
      properties: {
        userId: { type: 'integer', example: 1 },
        action: { type: 'string', example: 'UPDATE' },
        targetTable: { type: 'string', example: 'REVIEWS' },
        targetId: { type: 'integer', example: 1 },
        metadata: { type: 'string', example: '{"status":"approved"}' },
      },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);