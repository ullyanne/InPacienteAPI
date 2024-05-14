import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function deletePatient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/patients/:patientCpf', {
      schema: {
        summary: 'Delete a patient registry by ID',
        tags: ['patients'],
        params: z.object({
          patientCpf: z.string()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { patientCpf } = request.params

      const appointment = await prisma.appointment.deleteMany({
        where: {
          patientCpf: patientCpf
        }
      })
      
      const patient = await prisma.patient.delete({
        where: {
          cpf: patientCpf
        }
      })

      if (patient === null){
        throw new Error('Patient not found.')
      }

      return reply.status(204).send()
    })
}