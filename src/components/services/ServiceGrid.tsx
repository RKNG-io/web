'use client';

import React from 'react';
import ServiceCard from '../report/ServiceCard';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface ServiceGridProps {
  services: Service[];
  onAddToCart?: (serviceId: string) => void;
}

export default function ServiceGrid({ services, onAddToCart }: ServiceGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
          price={service.price}
          onAdd={onAddToCart ? () => onAddToCart(service.id) : undefined}
        />
      ))}
    </div>
  );
}
