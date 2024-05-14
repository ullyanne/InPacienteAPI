import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function deleteAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/appointments/:appointmentId', {
      schema: {
        summary: 'Delete an appointment registry by ID',
        tags: ['appointments'],
        params: z.object({
          appointmentId: z.string().uuid()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { appointmentId } = request.params

      const appointment = await prisma.appointment.delete({
        where: {
          id: appointmentId
        }
      })

      if (appointment === null){
        throw new Error('Patient not found.')
      }

      return reply.status(204).send()
    })
}