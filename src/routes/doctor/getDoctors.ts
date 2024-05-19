import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getDoctors(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/doctors', {
      schema: {
        summary: 'Returns doctor data by ID',
        tags: ['doctors'],
        querystring: z.object({
          search: z.string().optional(),
          pageIndex: z.string().optional().nullable().default('0').transform(Number)
        }),
        response: {
          200: z.object({
            doctors: z.array(
              z.object({
                crm: z.string(),
                name: z.string(),
                specialty: z.string(),
              })
            ),
            doctorsAmount: z.number(),
          })
        }
      }
    }, async (request, reply) => {

      const searchQuery = request.query.search
      const filteredSearchQuery = typeof searchQuery === 'string'
        ? searchQuery.replace(/[^\p{L}\p{N}\s%]/gu, '').replace(/[\s]/, '&')
        : '';

      const pageIndex = request.query.pageIndex

      const doctorsAmount = await prisma.doctor.count()

      const doctors = await prisma.doctor.findMany({
        select: {
          crm: true,
          name: true,
          specialty: true
        },
        where: {
          OR: [
            {
              crm: {
                startsWith: filteredSearchQuery
              }
            },
            {
              name: {
                search: filteredSearchQuery
              }
            },
            {
              specialty: {
                startsWith: filteredSearchQuery,
                mode: 'insensitive'
              }
            },
          ]
        },

        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: 'desc'
        }
      })

      return reply.send({ doctors: doctors, doctorsAmount: doctorsAmount })
    })
}