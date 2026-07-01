import { fondoDe, type TipoContenido } from "./panel";

/* Thumbnail blureado del contenido — el blur evita que los placeholders/imágenes
   se vean "falsos" y da el aire de preview protegido (vender la plataforma).
   Va como capa de fondo dentro de un contenedor relative+overflow-hidden;
   los chips/labels se ponen DESPUÉS para quedar nítidos encima. */
export function Thumb({ img, tipo, blur = 7 }: { img?: string; tipo: TipoContenido; blur?: number }) {
  const bg = img
    ? { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: fondoDe(tipo) };
  return (
    <>
      <div className="absolute inset-0" style={{ ...bg, filter: `blur(${blur}px)`, transform: "scale(1.14)" }} />
      <div className="absolute inset-0 bg-black/25" />
    </>
  );
}
