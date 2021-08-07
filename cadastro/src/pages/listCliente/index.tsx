import styles from './styles.module.css';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListagemCliente() {

    const [clientes, setClientes] = useState([]);

    async function getClientes() {

        const { data } = await api.get('clientes');
        setClientes(data);
        
    }

    useEffect(() => {

        getClientes();

    },[]);


    function seachClientes(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerListagemClientes + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-cliente').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    return (
        <div className={styles.containerListagem}>
            {
                (

                    <>
                        <h3 className="fa fa-user fa-3x"> Clientes</h3>
                        <div className={styles.containerSearch}>
                            <input type="search" placeholder="pesquisar: Nome" onInput={seachClientes} />
                            <Link href={'/clientes/0'}>
                                <a className="fas fa-plus fa-2x" title="Novo Cliente"></a>
                            </Link>
                        </div>
                        <div className={styles.containerListagemClientes}>
                            <ul>
                                {
                                    clientes.map((item) => {
                                        return (
                                            <li key={item.id} data-cliente={item.nome}>
                                                <span>Cliente: {item.nome}</span>
                                                <span style={{ display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
                                                    <Link href={'/clientes/' + item.id}>
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