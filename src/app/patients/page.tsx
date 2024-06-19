import { Heading, TextLink } from "@/components/ui/text";
import { db } from "@/database";

const PatientsPage = async () => {
  const patients = await db.query.patients.findMany();

  return (
    <div>
      <Heading>Patients</Heading>

      <div className="mt-12">
        {patients.map((patient) => (
          <div key={patient.id}>
            <TextLink href={`/patients/${patient.id}/chat`}>
              {patient.name}
            </TextLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientsPage;
