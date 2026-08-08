'use client';

import React, { useState } from 'react';

export default function FAQGenerator({ productName }: { productName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const name = productName || 'this item';
  const nameLower = name.toLowerCase();

  let categorySpecificQuestion = `What makes the ${name} stand out from competitors?`;
  let categorySpecificAnswer = `The ${name} excels in build quality, performance stability, and price-to-spec ratio compared to rival models in its class.`;

  if (nameLower.includes('headphone') || nameLower.includes('airpods') || nameLower.includes('earbuds') || nameLower.includes('speaker') || nameLower.includes('audio') || nameLower.includes('sound')) {
    categorySpecificQuestion = `How is the audio quality and noise cancellation on the ${name}?`;
    categorySpecificAnswer = `Our testing shows the ${name} delivers crisp highs, balanced mid-range response, and deep low-end bass. Active noise cancellation effectively dampens low-frequency environmental noise.`;
  } else if (nameLower.includes('phone') || nameLower.includes('watch') || nameLower.includes('ipad') || nameLower.includes('macbook') || nameLower.includes('laptop') || nameLower.includes('tab')) {
    categorySpecificQuestion = `What is the real-world battery life and performance of the ${name}?`;
    categorySpecificAnswer = `Under daily mixed workloads, the ${name} handles intensive multitasking effortlessly with strong thermal management and reliable battery endurance.`;
  } else if (nameLower.includes('camera') || nameLower.includes('gopro') || nameLower.includes('drone') || nameLower.includes('insta360')) {
    categorySpecificQuestion = `Is the ${name} suitable for professional content creation?`;
    categorySpecificAnswer = `Yes, the ${name} features robust image stabilization, high dynamic range color processing, and excellent low-light optical performance.`;
  }

  const faqs = [
    {
      question: `Is the ${name} worth buying in 2026?`,
      answer: `Yes. Based on empirical benchmark data and buyer satisfaction metrics, the ${name} ranks among the top recommendations in its category, especially when purchased on sale.`
    },
    {
      question: categorySpecificQuestion,
      answer: categorySpecificAnswer
    },
    {
      question: `Where can I find verified live deals for the ${name}?`,
      answer: `We continuously monitor pricing APIs across Amazon, eBay, Walmart, BestBuy, and regional retailers. Use our live comparison table above to verify current stock and lowest prices.`
    },
    {
      question: `Does the ${name} come with a manufacturer warranty?`,
      answer: `When purchased through authorized retailers listed in our comparison guide, the ${name} includes standard full manufacturer warranty coverage and hassle-free return policies.`
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 mt-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-grow h-px bg-white/10"></div>
        <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
        <div className="flex-grow h-px bg-white/10"></div>
      </div>
      
      {/* FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
            <button 
              className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="font-bold text-lg text-slate-200">{faq.question}</h3>
              <svg 
                className={`w-6 h-6 text-indigo-400 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
