import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function createDoctor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/doctors', {
      schema: {
        summary: 'Create a doctor registry',
        tags: ['doctors'],
        body: z.object({
          crm: z.string(),
          specialty: z.string(),
          name: z.string(),
        }),
        response: {
          201: z.object({
            doctorCrm: z.string()
          })
        }
      }
    }, async (request, reply) => {

      const { crm, specialty, name } = request.body

      const doesDoctorExist = await prisma.doctor.findUnique({
        where: {
          crm: crm
        }
      })

      if (doesDoctorExist){
        return reply.status(409).send()
      }

      const doctor = await prisma.doctor.create({
        data: {
          crm,
          specialty,
          name,
        }
      })

      return reply.status(201).send({ doctorCrm: doctor.crm })
    })
}