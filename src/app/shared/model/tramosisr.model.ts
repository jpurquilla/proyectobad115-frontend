// Define la estructura de los tramos de ISR
interface TramoISR {
  desde: number;
  hasta: number;
  porcentaje: number;
  cuotaFija: number;
  sobre: number;
}

// Propiedades adicionales para el componente
tablasISR = {
  mensual: [
    { desde: 0.01, hasta: 472.00, porcentaje: 0, cuotaFija: 0, sobre: 0 },
    { desde: 472.01, hasta: 895.24, porcentaje: 0.1, cuotaFija: 17.67, sobre: 472.00 },
    { desde: 895.25, hasta: 2038.10, porcentaje: 0.2, cuotaFija: 60.00, sobre: 895.24 },
    { desde: 2038.11, hasta: Number.MAX_VALUE, porcentaje: 0.3, cuotaFija: 288.57, sobre: 2038.10 }
  ] as TramoISR[],
  quincenal: [
    { desde: 0.01, hasta: 236.00, porcentaje: 0, cuotaFija: 0, sobre: 0 },
    { desde: 236.01, hasta: 447.62, porcentaje: 0.1, cuotaFija: 8.83, sobre: 236.00 },
    { desde: 447.63, hasta: 1019.05, porcentaje: 0.2, cuotaFija: 30.00, sobre: 447.62 },
    { desde: 1019.06, hasta: Number.MAX_VALUE, porcentaje: 0.3, cuotaFija: 144.28, sobre: 1019.05 }
  ] as TramoISR[]
};