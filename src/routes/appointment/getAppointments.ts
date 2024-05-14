import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getAppointments(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/appointments', {
      schema: {
        querystring: z.object({
          search: z.string().optional(),
          pageIndex: z.string().optional().nullable().default('0').transform(Number)
        }),
        response: {
          200: z.object({
            appointments: z.array(
              z.object({
                id: z.string().uuid(),
                doctor: z.object({
                  name: z.string(),
                  specialty: z.string()
                }),
                patient: z.object({
                  name: z.string()
                }),
                date: z.date(),
              })
            ),
            appointmentsAmount: z.number()
          })
        }
      }
    }, async (request, reply) => {

      const searchQuery = request.query.search || undefined
      const filteredSearchQuery = typeof searchQuery === 'string'
        ? searchQuery.replace(/[^\p{L}\p{N}\s%]/gu, '').replace(/[\s]/, '&')
        : undefined;

      const pageIndex = request.query.pageIndex

      const appointmentsAmount = await prisma.appointment.count()

      const appointments = await prisma.appointment.findMany(
        {
          select: {
            id: true,
            doctor: {
              select: {
                name: true,
                specialty: true
              }
            },
            patient: {
              select: {
                name: true,
              }
            },
            date: true,
          },

          where: {
            OR: [
              {
                doctor: {
                  name: {
                    search: filteredSearchQuery
                  }
                }
              },
              {
                doctor: {
                  specialty: {
                    startsWith: filteredSearchQuery
                  }
                }
              },
              {
                patient: {
                  name: {
                    search: filteredSearchQuery
                  }
                }
              }
            ]
          },

          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      )

      return reply.status(200).send(
        {
          appointments: appointments,
          appointmentsAmount: appointmentsAmount
        }
      )
    })
}