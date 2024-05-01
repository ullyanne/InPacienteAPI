import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getPatientAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/patients/:patientCpf/appointments', {
      schema: {
        params: z.object({
          patientCpf: z.string()
        }),
        response: {
          201: z.object({
            appointments: z.array(
              z.object({
                id: z.string().uuid(),
                date: z.date(),
                doctorCrm: z.string()
              })
            )
          })
        }
      }
    }, async (request, reply) => {

      const { patientCpf } = request.params

      const appointments = await prisma.appointment.findMany(
        {
          select: {
            id: true,
            date: true,
            doctorCrm: true,
          },

          where: {
            patientCpf: patientCpf
          }
        }
      )

      return reply.status(201).send({ appointments: appointments })
    })
}