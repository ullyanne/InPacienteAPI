import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '../../lib/prisma';

export async function updateAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/appointments/:appointmentId', {
      schema: {
        body: z.object({
          date: z.string().datetime().optional(),
          patientCpf: z.string().optional(),
          doctorCrm: z.string().optional()
        }),
        params: z.object({
          appointmentId: z.string().uuid()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { appointmentId } = request.params
      const { date, patientCpf, doctorCrm } = request.body

      const appointment = await prisma.appointment.update({
        data: {
          date,
          patientCpf,
          doctorCrm
        },
        where: {
          id: appointmentId
        }
      })

      if (appointment === null) {
        throw new Error('Appointment not found.')
      }

      return reply.status(204).send()
    })
}