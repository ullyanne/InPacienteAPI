import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/appointments/:appointmentId', {
      schema: {
        summary: 'Returns appointment data by ID',
        tags: ['appointments'],
        params: z.object({
          appointmentId: z.string()
        }),
        response: {
          200: z.object({
            appointment: z.object({
              id: z.string().uuid(),
              date: z.date(),
              doctorCrm: z.string(),
              patientCpf: z.string()
            })
          })
        }
      }
    }, async (request, reply) => {

      const { appointmentId } = request.params

      const appointment = await prisma.appointment.findUnique({
        select: {
          id: true,
          date: true,
          doctorCrm: true,
          patientCpf: true
        },
        where: {
          id: appointmentId,
        }
      })

      if (appointment === null) {
        throw new Error('Patient not found.')
      }

      return reply.send(
        {
          appointment: appointment
        })
    })
}