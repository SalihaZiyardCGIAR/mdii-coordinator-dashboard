import React from "react";

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
