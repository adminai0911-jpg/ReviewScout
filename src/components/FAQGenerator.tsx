'use client';

import React, { useState } from 'react';

export default function FAQGenerator({ productName }: { productName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: `Is the ${productName} worth the money?`,
      answer: `Yes, based on our analysis of price drops and feature sets, the ${productName} offers excellent value for the money, especially if you can secure it during a flash sale or price drop.`
    },
    {
      question: `Where can I find the best deal for the ${productName}?`,
      answer: `We actively track Amazon, AliExpress, and ShareASale. Check our live price comparison table above for the absolute lowest verified price available today.`
    },
    {
      question: `Does the ${productName} go on sale often?`,
      answer: `Our AI price tracker indicates that this category typically sees discounts during major retail events like Black Friday, Cyber Monday, and regional holiday sales.`
    },
    {
      question: `What are the pros and cons of the ${productName}?`,
      answer: `The primary pros include its high-end build quality and reliable performance. The main con is typically the retail price, which is why we highly recommend using our price tracker to buy it on discount.`
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
