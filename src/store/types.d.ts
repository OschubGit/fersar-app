/* export interface Contador {
  key: number;
  location: Location;
  data: ContadorData;
  estado: string;
} */
export interface Contador {
  id: number;
  tipo: string;
  cont_pul: string;
  soc_cod: string;
  nombre_completo: string;
  poligono: string;
  parcela: string;
  zona: string;
  zona_numero: string;
  latitud: any;
  longitud: any;
  estado: string;
  ultima_lectura: UltimaLectura[];
  position: google.maps.LatLngLiteral;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface ContadorData {
  nombre_completo: string;
  parcela: string;
  poligono: string;
  zona: string;
  zona_numero: string;
  estado: string;
}

export type Contadores = Contador[];

export interface FetchContadores {
  id: number;
  tipo: string;
  cont_pul: string;
  soc_cod: string;
  nombre_completo: string;
  poligono: string;
  parcela: string;
  zona: string;
  zona_numero: string;
  latitud: any;
  longitud: any;
  estado: string;
  ultima_lectura: UltimaLectura[];
  position: google.maps.LatLngLiteral;
  err_ultima_lectura: UltimaLectura;
}

export interface UltimaLectura {
  id: number;
  contador_id: number;
  fecha: string;
  lectura: any;
  consumo: any;
}
