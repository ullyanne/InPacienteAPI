import fastify from "fastify";
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod"
import { createPatient } from "@routes/patient/createPatient";
import { getPatient } from "@routes/patient/getPatient";
import { createAppointment } from "@routes/appointment/createAppointment";
import { createDoctor } from "@routes/doctor/createDoctor";
import { getPatientAppointment } from "@routes/patient/getPatientAppointment";
import { getDoctor } from "@routes/doctor/getDoctor";
import { deletePatient } from "@routes/patient/deletePatient";
import { deleteAppointment } from "@routes/appointment/deleteAppointment";
import { deleteDoctor } from "@routes/doctor/deleteDoctor";
import { updateAppointment } from "@routes/appointment/updateAppointment";
import { updatePatient } from "@routes/patient/updatePatient";
import { updateDoctor } from "@routes/doctor/updateDoctor";
import { getPatients } from "@routes/patient/getPatients";
import { getAppointments } from "@routes/appointment/getAppointments";
import { getAppointment } from "@routes/appointment/getAppointment";
import { getDoctors } from "@routes/doctor/getDoctors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = fastify()

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'InPaciente',
      description: 'Especificações da API https://github.com/ullyanne/InPacienteAPI ',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(cors, {
  origin: '*',
  methods: '*'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createPatient)
app.register(getPatient)
app.register(deletePatient)
app.register(updatePatient)
app.register(getPatients)

app.register(createAppointment)
app.register(getAppointments)
app.register(getAppointment)
app.register(getPatientAppointment)
app.register(deleteAppointment)
app.register(updateAppointment)

app.register(createDoctor)
app.register(getDoctor)
app.register(getDoctors)
app.register(deleteDoctor)
app.register(updateDoctor)

app.listen({ port: 3333 }) 
