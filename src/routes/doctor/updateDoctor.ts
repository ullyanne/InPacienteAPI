import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function updateDoctor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/doctors/:doctorCrm', {
      schema: {
        body: z.object({
          crm: z.string().optional(),
          specialty: z.string().optional()
        }),
        params: z.object({
          doctorCrm: z.string()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { doctorCrm } = request.params
      const { crm, specialty } = request.body

      const doctor = await prisma.doctor.update({
        data: {
          crm,
          specialty
        },
        where: {
          crm: doctorCrm
        }
      })

      if (doctor === null) {
        throw new Error('Doctor not found.')
      }

      return reply.status(204).send()
    })
}