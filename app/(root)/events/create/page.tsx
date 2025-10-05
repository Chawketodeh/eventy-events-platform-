import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";

const CreateEvent = async () => {
  const { userId } = await auth(); // ✅ use userId directly (no sessionClaims)

  if (!userId) {
    // redirect to sign-in if not authenticated
    return (
      <section className="wrapper py-10 text-center">
        <h2 className="text-2xl font-semibold text-red-500">
          You must sign in to create an event.
        </h2>
      </section>
    );
  }

  return (
    <>
      <section className="bg-secondary bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
