import '../styles/globals.css'
import { Menu } from "../componentes/Menu/menu";

import stylesEstado from './estados/styles.module.css';
import stylesListEstado from './listEstado/styles.module.css';
import stylesPais from './pais/styles.module.css';
import stylesListPais from './listPais/styles.module.css';
import stylesCidades from './cidades/styles.module.css';
import stylesListCidades from './listCidade/styles.module.css';
import stylesClientes from './clientes/styles.module.css';
import stylesListClientes from './listCliente/styles.module.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <span className={
      stylesCidades.cls+' '+
      stylesListCidades.cls+' '+
      stylesClientes.cls+' '+
      stylesListClientes.cls+' '+
      stylesEstado.cls+' '+
      stylesListEstado.cls+' '+
      stylesPais.cls+' '+
      stylesListPais.cls } style={{display:'none'}}></span>
      <div className='divBack'></div>
      <div className='container'>
        <Menu />
        <Component {...pageProps} /> 
      </div>
    </>
  )
}

export default MyApp
