'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import './styles/Home.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button className={`button ${className}`} {...props}>
    {children}
  </button>
);

export default function Home() {
  return (
    <div className="page">
      
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="image-wrapper"
      >
        <Image
          src="/tj.jpg"
          alt="Terrazas JACK"
          width={600}
          height={400}
          className="image"
          priority
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="title"
      >
        Terrazas JACK
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="description"
      >
        Encuentra las mejores terrazas para disfrutar en familia o con amigos (straight up!)
      </motion.p>

      {/* Buttons */}
      <div className="button-group">
        <Link href="/auth/register">
          <Button>
            Registrarse
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button>
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </div>
  );
}
