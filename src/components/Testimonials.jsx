export default function Testimonials() {
  const testimonials = [
    { name: "Rahim", feedback: "Care.xyz made booking a caregiver so easy and safe!" },
    { name: "Sohana", feedback: "Professional and compassionate service for my grandmother." },
    { name: "Jamil", feedback: "Highly recommend for busy parents looking for baby care." }
  ];

  return (
    <section id="testimonials" className="bg-primary text-white py-24">
      <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white text-gray-800 p-6 rounded shadow">
            <p className="mb-4">`{t.feedback}`</p>
            <h4 className="font-bold">{t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
