import React, { useEffect, useRef, useState } from 'react'
import LocationCard from '../components/LocationCard';
import SocialGroup from '../components/SocialGroup';
import PartnerCard from '../components/PartnerCard';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsDown } from 'lucide-react';
import NavBar from '../components/NavBar';

//imports das imagens
import heroImg from "../assets/int-bgless.png";
import heroCardImg from "../assets/int-3.png"
import quemSomosImg from "../assets/alunaSquared.jpg";
import servicosImg from "../assets/servicos.jpg";
import locRuilheImg from "../assets/missaoSaberSquared.jpg";
import locBragaImg from "../assets/licoesQuestoes.jpeg";
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import fregRuilheImg from "../assets/fregRuilhe.png";
import alfacoopImg from "../assets/alfacoop.png";
import cardLoja from "../assets/Card-ASAS-loja.png";
import cardMissao from "../assets/Card-ASAS-missaosaber.png";
import cardLivro from "../assets/Card-ASAS-livro.png";

function HomePage() {
  useEffect(() => {
    //Auto-scroll do carousel
    iniciarTimer()

    return () => clearInterval(timerRef.current);
  }, []);
  //Sildes para carousel das paginas
  const slides = [cardLivro, cardLoja, cardMissao]
  const [slideAtual, setSlideAtual] = useState(0)
  const slideAnterior = () => {
    setSlideAtual((atual) => 
      atual === 0 ? slides.length - 1 : atual - 1
    )
    iniciarTimer()
  }
  const slideSeguinte = () => {
    setSlideAtual((atual) => 
      atual === slides.length - 1 ? 0 : atual + 1
    )
    iniciarTimer()
  }

  //Funcoes para temporizador do auto-play
  const timerRef = useRef(null);
  const tempoSlide = 5000;
  const iniciarTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSlideAtual((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, tempoSlide)};

  //Funcao para voltar ao topo da pagina
  const voltarTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <main className="w-full bg-base-100">
      {/* Ecra de logotipo */}
      <section className="w-full h-[55vh] sm:h-[65vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="ASAS — Associação Social Acreditar e Sonhar" className="block w-full max-w-full h-full object-contain"/>
      </section>

      {/* Navbar (posicao personalizada) */}
      <NavBar />

      {/* Quem Somos */}
      <div className='bg-primary'>
        <button className='w-full' onClick={() => window.scrollTo({ top: innerHeight-50, behavior: "smooth" })}>
          <div className='flex items-center justify-center'>
            <ChevronDown color='#ffffff' className='size-10'/>
          </div>
        </button>
      <section className="max-w-6xl mx-auto px-4 py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img src={quemSomosImg} alt="Quem Somos" className="w-full rounded-2xl shadow-lg"/>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-100 mb-6">
              Quem Somos?
            </h1>

            <p className="text-xl leading-relaxed text-base-100">
              A Associação Social Acreditar e Sonhar ASAS tem como missão promover o bem-estar da sociedade, possibilitando o acesso a
              serviços e bens que garantam o equilíbrio do seu desenvolvimento psicossocial.
              <br />
              <br />
              O Centro de Estudos Missão Saber nasce como uma parceria entre a ASAS e a Junta de Freguesia de Ruilhe, com o objetivo de
              disponibilizar um serviço de promoção de competências alargado, potenciando a autonomia dos alunos e o seu sucesso escolar.
            </p>
          </div>
        </div>
      </section>
      </div>

      {/* Serviços */}
      <img src={servicosImg} alt="Serviços" className="w-full object-cover"/>

      {/* Carousel de Novidades */}
      <section className="w-full py-10 px-4" onMouseEnter={() => clearInterval(timerRef.current)} onMouseLeave={iniciarTimer}>
        <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
          {/* Janela do carousel */}
          <div className="overflow-hidden rounded-2xl">
            {/* Faixa que contem todos os slides */}
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${slideAtual * 100}%)` }}>
              {slides.map((img, index) => (
                <div key={index} className="w-full shrink-0 flex justify-center">
                  <img src={img} alt={`Novidade ${index + 1}`} className="block w-full h-auto object-contain"/>
                </div>
              ))}
            </div>
          </div>

          {/* Botão anterior */}
          <button type="button" className=" btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 z-10" onClick={slideAnterior}aria-label="Slide anterior">
            <ChevronLeft className="size-5" />
          </button>

          {/* Botão seguinte */}
          <button type="button" className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 z-10" onClick={slideSeguinte} aria-label="Slide seguinte">
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button key={index} type="button" aria-label={`Ir para o slide ${index + 1}`} className={`h-3 w-3 rounded-full transition-all ${slideAtual === index ? "bg-primary scale-110" : "bg-base-300"}`} onClick={() => {setSlideAtual(index); iniciarTimer();}}/>
          ))}
        </div>
      </section>

      {/* Onde estamos */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Onde estamos?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <LocationCard image={heroCardImg} address="Rua Cruz de Pedra, n.º189, Braga" mapUrl="https://maps.app.goo.gl/135R2N6amonBzBiZ7" phone="936 312 310" email="geralasas2021@gmail.com"/>

          <LocationCard image={locRuilheImg} address="Largo 25 de Abril, Junta de Freguesia de Ruilhe, Braga" mapUrl="https://maps.app.goo.gl/qMW3p3EPC6QEdZGj6" phone="936 312 310" email="missaosaber.centroestudos@gmail.com"/>

          <LocationCard image={locBragaImg} address="Rua Cruz de Pedra, n.º193, Braga" mapUrl="https://maps.app.goo.gl/tWasQaj9SgnyF7B99" phone="253 047 064" email="licoes.e.questoes@gmail.com"/>
        </div>
      </section>

      {/* Redes sociais e parceiros */}
      <section className="bg-primary text-primary-content py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">
            Voamos Juntos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <SocialGroup title="Associação ASAS" facebook="https://www.facebook.com/p/ASAS-Associa%C3%A7%C3%A3o-Social-Acreditar-e-Sonhar-100080498824455/" instagram="https://www.instagram.com/asas_acreditar_e_sonhar/"/>

            <SocialGroup title="Missão Saber" facebook="https://www.facebook.com/share/18eau5AEmL/" instagram="https://www.instagram.com/missao_saber/"/>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-10">
            Parceiros
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <PartnerCard image={fregRuilheImg} title="Junta de Freguesia de Ruilhe"/>

            <PartnerCard image={alfacoopImg} title="Colégio ALFACOOP"/>
          </div>

          <button onClick={voltarTopo} className="btn btn-ghost mt-12 underline">
            Voltar ao topo da página
          </button>
        </div>
      </section>
    </main>
  )
}

export default HomePage
