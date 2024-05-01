import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function updatePatient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/patients/:patientCpf', {
      schema: {
        body: z.object({
          address: z.string().optional(),
          phoneNumber: z.string().optional()
        }),
        params: z.object({
          patientCpf: z.string()
        }),
        response: {
          204: z.null()
        }
      }
    }, async (request, reply) => {

      const { patientCpf } = request.params
      const { address, phoneNumber } = request.body

      const patient = await prisma.patient.update({
        data: {
          address,
          phoneNumber
        },
        where: {
          cpf: patientCpf
        }
      })

      if (patient === null) {
        throw new Error('Patient not found.')
      }

      return reply.status(204).send()
    })
}