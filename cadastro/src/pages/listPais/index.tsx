import styles from './styles.module.css';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListagemPais() {

    const [pais, setPais] = useState([]);

    async function getPais() {

        const { data } = await api.get('pais');
        setPais(data);
        
    }

    useEffect(() => {

        getPais();

    },[]);


    function seachPais(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerListagemPais + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-pais').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    return (
        <div className={styles.containerListagem}>
            {
                (

                    <>
                        <h3 className="fa fa-flag fa-3x"> PAÍS</h3>
                        <div className={styles.containerSearch}>
                            <input type="search" placeholder="pesquisar: Pais" onInput={seachPais} />
                            <Link href={'/pais/0'}>
                                <a className="fas fa-plus fa-2x" title="Novo País"></a>
                            </Link>
                        </div>
                        <div className={styles.containerListagemPais}>
                            <ul>
                                {
                                    pais.map((item) => {
                                        return (
                                            <li key={item.id} data-pais={item.pais}>
                                                <span>País: {item.pais}</span>
                                                <span style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                                                    <Link href={'/pais/' + item.id}>
                                                        <a className="fas fa-search"></a>
                                                    </Link>
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </>

                )

            }
        </div>
    )
}