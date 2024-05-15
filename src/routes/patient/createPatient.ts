import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function createPatient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/patients', {
      schema: {
        summary: 'Create a patient registry',
        tags: ['patients'],
        body: z.object({
          cpf: z.string(),
          name: z.string(),
          address: z.string(),
          phoneNumber: z.string().nullable()
        }),
        response: {
          201: z.object({
            patientCpf: z.string()
          })
        }
      }
    }, async (request, reply) => {

      const data = request.body

      const doesPatientExist = await prisma.patient.findUnique({
        where: {
          cpf: data.cpf,
        }
      })

      if (doesPatientExist){
        return reply.status(409).send()
      }

      const patient = await prisma.patient.create({
        data: {
          cpf: data.cpf,
          name: data.name,
          address: data.address,
          phoneNumber: data.phoneNumber,
        }
      })

      return reply.status(201).send({ patientCpf: patient.cpf })
    })
}