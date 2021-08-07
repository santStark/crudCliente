import styles from './styles.module.css';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListagemCidade() {

    const [cidades, setCidades] = useState([]);

    async function getCidades() {

        const { data } = await api.get('cidades');
        setCidades(data);
        
    }

    useEffect(() => {

        getCidades();

    },[]);


    function seachCidades(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerListagemCidades + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-cidade').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    return (
        <div className={styles.containerListagem}>
            {
                (

                    <>
                        <h3 className="fa fa-building fa-3x"> Cidades</h3>
                        <div className={styles.containerSearch}>
                            <input type="search" placeholder="pesquisar: Cidades" onInput={seachCidades} />
                            <Link href={'/cidades/0'}>
                                <a className="fas fa-plus fa-2x" title="Novo Estado"></a>
                            </Link>
                        </div>
                        <div className={styles.containerListagemCidades}>
                            <ul>
                                {
                                    cidades.map((item) => {
                                        return (
                                            <li key={item.id} data-cidade={item.cidade}>
                                                <span>Cid.: {item.cidade}</span>
                                                <span>UF: {item.uf}</span>
                                                <span style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                                                    <Link href={'/cidades/' + item.id}>
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