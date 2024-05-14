import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from '@lib/prisma';

export async function getPatient(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/patients/:patientCpf', {
      schema: {
        params: z.object({
          patientCpf: z.string()
        }),
        response: {
          200: z.object({
            patient: z.object({
              cpf: z.string(),
              name: z.string(),
              address: z.string(),
              phoneNumber: z.string().nullable(),
              appointmentsAmount: z.number().int()
            })
          })
        }
      }
    }, async (request, reply) => {

      const { patientCpf } = request.params

      const patient = await prisma.patient.findUnique({
        select: {
          cpf: true,
          name: true,
          address: true,
          phoneNumber: true,
          _count: {
            select: {
              appointments: true
            }
          }
        },
        where: {
          cpf: patientCpf,
        }
      })

      if (patient === null){
        return reply.status(404).send()
      }

      return reply.send({
        patient: {
          cpf: patient.cpf,
          name: patient.name,
          address: patient.address,
          phoneNumber: patient.phoneNumber,
          appointmentsAmount: patient._count.appointments
        }})
    })
}