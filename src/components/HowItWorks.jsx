export default function HowItWorks() {
  const steps = [
    "Choose a service and duration",
    "Select location and provide address",
    "Confirm booking and payment",
    "Track booking status"
  ];

  return (
    <section className="py-24 max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-8 text-center">
        {steps.map((step, i) => (
          <div key={i} className="p-6 bg-white shadow rounded">
            <div className="text-2xl font-bold mb-2">{i+1}</div>
            <p className="text-gray-600">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
