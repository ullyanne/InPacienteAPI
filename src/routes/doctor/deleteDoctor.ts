import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '../../lib/prisma';

export async function deleteDoctor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/doctors/:doctorCrm', {
      schema: {
        params: z.object({
          doctorCrm: z.string()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { doctorCrm } = request.params

      const appointment = await prisma.appointment.deleteMany({
        where: {
          doctorCrm: doctorCrm
        }
      })

      const doctor = await prisma.doctor.delete({
        where: {
          crm: doctorCrm
        }
      })

      if (doctor === null){
        throw new Error('Doctor not found.')
      }

      return reply.status(204).send()
    })
}