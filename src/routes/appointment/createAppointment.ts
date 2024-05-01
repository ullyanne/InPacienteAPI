import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '../../lib/prisma';

export async function createAppointment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/appointments', {
      schema: {
        body: z.object({
          patientCpf: z.string(),
          date: z.string().datetime(),
          doctorCrm: z.string()
        }),
        response: {
          201: z.object({
            appointmentId: z.string().uuid()
          })
        }
      }
    }, async (request, reply) => {

      const { patientCpf, date, doctorCrm } = request.body

      const appointment = await prisma.appointment.create({
        data: {
          date,
          patientCpf,
          doctorCrm,
        }
      })

      return reply.status(201).send({ appointmentId: appointment.id })
    })
}