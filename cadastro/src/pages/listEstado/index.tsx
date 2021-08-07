import styles from './styles.module.css';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListagemEstados() {

    const [estados, setEstados] = useState([]);

    async function getEstados() {

        const { data } = await api.get('estados');
        setEstados(data);
        
    }

    useEffect(() => {

        getEstados();

    },[]);


    function seachEstados(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerListagemestados + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-estados').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    return (
        <div className={styles.containerListagem}>
            {
                (

                    <>
                        <h3 className="fa fa-city fa-3x"> Estados</h3>
                        <div className={styles.containerSearch}>
                            <input type="search" placeholder="pesquisar: Estados" onInput={seachEstados} />
                            <Link href={'/estados/0'}>
                                <a className="fas fa-plus fa-2x" title="Novo Estado"></a>
                            </Link>
                        </div>
                        <div className={styles.containerListagemEstados}>
                            <ul>
                                {
                                    estados.map((item) => {
                                        return (
                                            <li key={item.id} data-estados={item.estados}>
                                                <span>Estado: {item.estado}</span>
                                                <span>UF: {item.uf}</span>
                                                <span style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                                                    <Link href={'/estados/' + item.id}>
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