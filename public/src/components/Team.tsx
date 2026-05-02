import { useScrollReveal } from '../hooks/useScrollReveal';

const members = [
  {
    name: 'Edgar Verdesoto',
    role: 'Encargado',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Mery Loyola',
    role: 'Encargada',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Josh Levin',
    role: 'El negro del TEAM',
    image: 'https://blogger.googleusercontent.com/img/a/AVvXsEgIIAA_pU_FM3sioFKR8XiKHnyh2FwO-ib-vmZfDTZxMG-F7_-21zUU2haflPSdaT-XkPF-6z42QhVcFbPSCqggL1jvh8l-k1AErWhzjd_Vq62S0BgBfPYwS_jtM53Ij-8WGcUoaBiAtwWY1nMYUbeEFK__6L-AcVxTMGf9xVk8MShqcOha21yNw99ET9w',
  },
  {
    name: 'Stiven Verdesoto',
    role: 'Marketing y redes sociales',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function Team() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="team" ref={ref as React.RefObject<HTMLElement>} className="py-24 bg-white/60 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.04),transparent_60%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">Las personas detrás</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4">
            Nuestro{' '}
            <span className="text-gradient-warm">equipo</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Somos una familia comprometida con servirte lo mejor cada día en Puerto Ayora.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {members.map((member, i) => (
            <div
              key={member.name}
              className={`group flex flex-col items-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: visible ? `${i * 120}ms` : "0ms" }}
            >
              <div className="relative mb-5">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400 shadow-lg group-hover:shadow-orange-200/70 group-hover:shadow-xl transition-all duration-400">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-900 font-black text-base leading-tight mb-1">{member.name}</div>
                <div className="text-orange-600 text-xs font-bold leading-snug">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
