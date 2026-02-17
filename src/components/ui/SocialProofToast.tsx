"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAMES = [
  "María", "Ana", "Lupita", "Carmen", "Rosa", "Patricia", "Laura",
  "Gabriela", "Sofía", "Alejandra", "Valentina", "Isabella", "Daniela",
];

const CITIES = [
  "Monterrey", "Guadalajara", "CDMX", "Puebla", "Cadereyta",
  "San Nicolás", "Apodaca", "Saltillo", "Querétaro", "León",
];

const PRODUCTS = [
  "Küül Cure Me Shampoo", "Voglia Tinte Profesional", "Nekane Mascarilla",
  "Vitale Keratina", "Montis Shampoo Natural", "Hidra Color Tinte",
  "Xiomara Gel Fijador", "Küül Color System",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", city: "", product: "", time: "" });

  const show = useCallback(() => {
    const minutes = Math.floor(Math.random() * 25) + 2;
    setData({
      name: randomItem(NAMES),
      city: randomItem(CITIES),
      product: randomItem(PRODUCTS),
      time: `hace ${minutes} min`,
    });
    setVisible(true);
    setTimeout(() => setVisible(false), 5000);
  }, []);

  useEffect(() => {
    const initial = setTimeout(show, 8000);
    const interval = setInterval(show, 30000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 left-4 z-40 max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 text-xs p-1"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <p className="text-xs text-gray-500">Pedido reciente</p>
          <p className="mt-0.5 text-sm font-medium text-sicaru-purple-900">
            {data.name} de {data.city}
          </p>
          <p className="text-xs text-gray-600">
            compró <span className="font-medium">{data.product}</span>
          </p>
          <p className="mt-1 text-[10px] text-gray-400">{data.time}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
