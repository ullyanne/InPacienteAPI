import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getPatients(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/patients', {
      schema: {
        querystring: z.object({
          search: z.string().optional()
        }),
        response: {
          200: z.object({
            patients: z.array(
              z.object({
                cpf: z.string(),
                name: z.string(),
                address: z.string(),
                phoneNumber: z.string().nullable(),
              })
            )
          })
        }
      }
    }, async (request, reply) => {

      const searchQuery = request.query.search
      const filteredSearchQuery = typeof searchQuery === 'string' 
      ? searchQuery.replace(/[^\p{L}\p{N}\s%]/gu, '').replace(/[\s]/, '&')
      : '';

      const patients = await prisma.patient.findMany({
        select: {
          cpf: true,
          name: true,
          address: true,
          phoneNumber: true,
        },
        where: {
          OR: [
            {
              cpf: {
                startsWith: filteredSearchQuery
              }
            },
            {
              name: {
                search: filteredSearchQuery
              }
            },
            {
              address: {
                search: filteredSearchQuery
              }
            },
            {
              phoneNumber: {
                startsWith: filteredSearchQuery
              }
            }
          ]

        }
      })

      // searchParams = '_' + searchParams

      return reply.send({ patients: patients })
    })
}