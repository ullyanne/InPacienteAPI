-- CreateTable
CREATE TABLE "patient" (
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("cpf")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "patientCpf" TEXT NOT NULL,
    "doctorCrm" TEXT NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor" (
    "crm" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("crm")
);

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patientCpf_fkey" FOREIGN KEY ("patientCpf") REFERENCES "patient"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctorCrm_fkey" FOREIGN KEY ("doctorCrm") REFERENCES "doctor"("crm") ON DELETE RESTRICT ON UPDATE CASCADE;
