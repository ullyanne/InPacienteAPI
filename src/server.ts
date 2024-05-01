import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { createPatient } from "@routes/patient/createPatient";
import { getPatient } from "@routes/patient/getPatient";
import { createAppointment } from "@routes/appointment/createAppointment";
import { createDoctor } from "@routes/doctor/createDoctor";
import { getPatientAppointment } from "@routes/appointment/getPatientAppointment";
import { getDoctor } from "@routes/doctor/getDoctor";
import { deletePatient } from "@routes/patient/deletePatient";
import { deleteAppointment } from "@routes/appointment/deleteAppointment";
import { deleteDoctor } from "@routes/doctor/deleteDoctor";
import { updateAppointment } from "@routes/appointment/updateAppointment";
import { updatePatient } from "@routes/patient/updatePatient";
import { updateDoctor } from "@routes/doctor/updateDoctor";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createPatient)
app.register(getPatient)
app.register(deletePatient)
app.register(updatePatient)

app.register(createAppointment)
app.register(getPatientAppointment)
app.register(deleteAppointment)
app.register(updateAppointment)

app.register(createDoctor)
app.register(getDoctor)
app.register(deleteDoctor)
app.register(updateDoctor)

app.listen({ port: 3333 }) 
