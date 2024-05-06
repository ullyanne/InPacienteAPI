-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_doctorCrm_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_patientCpf_fkey";

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patientCpf_fkey" FOREIGN KEY ("patientCpf") REFERENCES "patient"("cpf") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctorCrm_fkey" FOREIGN KEY ("doctorCrm") REFERENCES "doctor"("crm") ON DELETE CASCADE ON UPDATE CASCADE;
