import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '../../lib/prisma';

export async function getDoctor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/doctors/:doctorCrm', {
      schema: {
        params: z.object({
          doctorCrm: z.string()
        }),
        response: {
          200: z.object({
            doctor: z.object({
              crm: z.string(),
              specialty: z.string(),
              name: z.string()
            })
          })
        }
      }
    }, async (request, reply) => {

      const { doctorCrm } = request.params

      const doctor = await prisma.doctor.findUnique({
        select: {
          crm: true,
          name: true,
          specialty: true
        },
        where: {
          crm: doctorCrm,
        }
      })

      if (doctor === null){
        throw new Error('Doctor not found.')
      }

      return reply.send({
        doctor: {
          crm: doctor.crm,
          name: doctor.name,
          specialty: doctor.specialty
        }})
    })
}