import styles from './styles.module.css';
import Link from 'next/link';

export function Menu() {

    function changeAtivo(e):void{

        const father = document.querySelector('.' +styles.containerMenu );
        if(!father) return;

        const active = father.querySelector('.'+styles.activeMenu);
        if(!active) return;
        active.classList.remove(styles.activeMenu);
        
        const el = e.target;
        if(!el) return;
        el.classList.add(styles.activeMenu);

    }

    return (
        <div className={styles.containerMenu}>

            <Link href='/'>
                <a className={"fa fa-home fa-2x " + styles.activeMenu} onClick={changeAtivo} title="Home"></a>
            </Link>

            <Link href='/listCliente'>
                <a className="fa fa-user fa-2x" title="Clientes" onClick={changeAtivo}></a>
            </Link>

            <Link href='/listPais'>
                <a className="fas fa-flag fa-2x" title="Pais" onClick={changeAtivo}></a>
            </Link>

            <Link href='/listEstado'>
                <a className="fas fa-city fa-2x" title="Estado" onClick={changeAtivo}></a>
            </Link>

            <Link href='/listCidade'>
                <a className="fas fa-building fa-2x" title="Cidade" onClick={changeAtivo}></a>
            </Link>

        </div>
    )


}