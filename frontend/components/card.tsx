import { ReactNode } from 'react';

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="card shadow-lg shadow-black/20">{children}</div>
);
