import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getPatientAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/patients/:patientCpf/appointments', {
      schema: {
        summary: 'Finds patient appointments by ID',
        tags: ['patients'],
        params: z.object({
          patientCpf: z.string()
        }),
        response: {
          200: z.object({
            patientAppointments: z.array(
              z.object({
                id: z.string().uuid(),
                date: z.date(),
                doctor: z.object({
                  name: z.string(),
                  specialty: z.string()
                }),
              })
            )
          })
        }
      }
    }, async (request, reply) => {

      const { patientCpf } = request.params

      const patientAppointments = await prisma.appointment.findMany(
        {
          select: {
            id: true,
            date: true,
            doctor: {
              select: {
                name: true,
                specialty: true
              }
            },
          },

          where: {
            patientCpf: patientCpf,
            date: {
              gte: new Date()
            }
          },
        }
      )

      return reply.status(200).send({ patientAppointments: patientAppointments })
    })
}