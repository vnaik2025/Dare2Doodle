const z = require('zod');

// Schema for creating a challenge
const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
  artStyle: z.enum(['Funny', 'Cartoon', 'Realistic', 'Abstract', 'Pixel']).optional(),
  tags: z.array(
    z.string().min(2).max(20).regex(/^[a-z0-9-]+$/)
  ).max(10).optional(),
  nsfw: z.boolean().optional()
});

// Schema for updating a challenge (all fields optional)
const updateSchema = createSchema.partial();

module.exports = {
  createSchema,
  updateSchema
};
