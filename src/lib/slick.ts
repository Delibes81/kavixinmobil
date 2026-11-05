import SlickModule from 'react-slick';

// react-slick solo publica CommonJS; con Vite 8 (Rolldown) el import por defecto
// puede llegar envuelto como { default: Slider }. Normalizamos aquí.
const Slider = ((SlickModule as unknown as { default?: typeof SlickModule }).default ??
  SlickModule) as typeof SlickModule;

type Slider = SlickModule;

export default Slider;
