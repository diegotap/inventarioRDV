import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Reporte {
  fecha: string;
  nombreArchivo: string;
  usuario: string;
}

export function ReportHistory() {
  const [historial, setHistorial] = useState<Reporte[]>([]);

  useEffect(() => {
    fetch('/api/reportes')
      .then(res => res.json())
      .then(data => setHistorial(data));
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 shadow space-y-2">
      <h2 className="text-xl font-bold mb-2">Historial de Reportes</h2>
      {historial.length === 0 ? (
        <p className="text-muted-foreground">No hay reportes generados aún.</p>
      ) : (
        <ul className="divide-y">
          {historial.map((reporte, idx) => (
            <li key={idx} className="py-2 flex justify-between items-center">
              <span>
                <b>{new Date(reporte.fecha).toLocaleString('es-ES')}</b>
                {" — "}
                {reporte.nombreArchivo}
                <a
                  href={`/reportes/${reporte.nombreArchivo}`}
                  download
                  className="text-primary underline ml-2"
                >
                  Descargar PDF
                </a>
              </span>
              <span className="text-xs text-muted-foreground">{reporte.usuario}</span>
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="destructive"
        onClick={() => {
          localStorage.removeItem('reportHistory');
          setHistorial([]);
        }}
      >
        Limpiar historial
      </Button>
    </div>
  );
}