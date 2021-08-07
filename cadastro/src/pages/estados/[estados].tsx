import styles from './styles.module.css';
import { api, toDate } from '../../services/api';
import { useRouter } from 'next/router'
import {  useEffect, useState } from 'react';

interface IEstados {
    id: number,
    estado: string,
    uf: string,
    idpais:number;
    pais:string;

}

export default function Estados() {

    const [estados, setEstados] = useState({} as IEstados);
    const [pais, setPais] = useState([]);
    const [isBtnSave, setIsBtnSave] = useState(false);
    const router = useRouter();

    async function getEstadosID() {

        const param = String(router.query.estados);
    
        if (param === undefined || param === 'undefined') return;

        const { data } = await api.get('estadoID/' + param)
   
        if (data.length === 0) {
            const obj = {} as IEstados;
            obj.id = 0;
            obj.estado = ' ';
            obj.uf = ' ';
            obj.pais = ' ';
            obj.idpais = 0;
            data.push(obj);
        }

        setEstados(data[0])

    }

    async function getPais() {

        const { data } = await api.get('pais');
        if (data.length === 0) return;

        setPais(data);

    }

    useEffect(() => {

        getEstadosID();
        getPais();

    }, [router.query.estados]);

    async function handleSubmit(event:MouseEvent|any) {

        event.preventDefault();

        const el = document.querySelector('.' + styles.containerEstados);
     

        const obj = {} as IEstados;
        obj.id = el.querySelector('input[data-field="id"]')['value'].trim();
        obj.estado = el.querySelector('input[data-field="estados"]')['value'].trim().substr(0,150);
        obj.uf = el.querySelector('input[data-field="uf"]')['value'].trim().substr(0,2);
        obj.pais = el.querySelector('input[data-field="pais"]').getAttribute('data-id');

        if(obj.pais === '0') obj.pais = '';

        const valid = validFields(obj);
        if(!valid.valid) {
            alert(valid.msg);
            return;
        }

        const { data } = await api.post('estado/', obj);

        if(estados.id === 0){
            alert('Estado adicionado!');
            router.back();
            return;
        }

        if (data[0] === 'true') {
            alert('Alteração realizada');
            setIsBtnSave(false);
        }


        changeBtnStates('del');

    }

    function validFields(obj:IEstados): {valid:boolean, msg:string} {

        let ret = {valid:true, msg: ''};

        Object.keys(obj).forEach((item) => {

            if(!ret.valid) return;

            if(obj[item] === ''){

                ret.valid = false;
                ret.msg = `O campo ${item} é obrigatório!`;

            }

        });

        return ret;

    }

    function handleChange(event:MouseEvent|any) {

        if (isBtnSave) return;

        changeBtnStates('add');
        setIsBtnSave(true);

    }

    function onBtnCancel() {

        if (!isBtnSave) return;

        changeBtnStates('del');

        setIsBtnSave(false);
        backValues();

    }

    function changeBtnStates(group: string) {

        const el = document.querySelector('.' + styles.containerBtns);

        if (!el) return;

        const btnSave = el.querySelector('.fa-save');
        const btnDel = el.querySelector('.fa-trash-alt');
        const btnCancel = el.querySelector('.fa-ban');
        const btnBack = el.querySelector('.fa-arrow-circle-left');

        if (group === 'add') {
            btnSave.classList.remove(styles.clsdisabled);
            btnCancel.classList.remove(styles.clsdisabled);

            btnDel.classList.add(styles.clsdisabled);
            btnBack.classList.add(styles.clsdisabled);
        } else {

            btnDel.classList.remove(styles.clsdisabled);
            btnBack.classList.remove(styles.clsdisabled);

            btnSave.classList.add(styles.clsdisabled);
            btnCancel.classList.add(styles.clsdisabled);
        }

    }

    function backValues() {

        const el = document.querySelector('.' + styles.containerFields);

        if (!el) return;

        el.querySelector('input[data-field="id"]')['value'] = estados.id;
        el.querySelector('input[data-field="estados"]')['value'] = estados.estado;
        el.querySelector('input[data-field="uf"]')['value'] = estados.uf;
        el.querySelector('input[data-field="pais"]')['value'] = estados.pais;
        el.querySelector('input[data-field="pais"]').setAttribute('data-id', estados.idpais.toString())

    }

    function onBtnBack() {

        router.back();

    }

    async function onBtnDel() {

        if(estados.id === 0) return;

        const { data } = await api.get('delEstadoID/' + estados.id);

        if (data[0] === 'true') {

            alert('Exclusão realizada');
            router.back();

        }else{

            alert('Existem dados vinculados a este registro!');
        }

        

    }

    //***************** */

    function openSearchPais() {

        const el = (document.querySelector('.' + styles.containerPesquisaPais) as HTMLElement);
        if (!el) return;

        el.style.display = '';

    }

    function seachPais(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerPesquisaPais + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-pais').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    function closeSearchPais() {
        const el = (document.querySelector('.' + styles.containerPesquisaPais) as HTMLElement);
        if (!el) return;
        el.style.display = 'none';
    }

    function clickPais(e) {

        const li = e.target.closest('li');
        if(!li) return;
        
        const i = li.getAttribute('data-index');
        const el = (document.querySelector('.' + styles.containerPesquisaPais) as HTMLElement);
        const fi = document.querySelector('.' + styles.containerFields);

        if (!i || !el || !fi) return;

        const input = fi.querySelector('input[data-field="pais"]');

        if (!input) return;

        input['value'] = pais[i].pais;
        input.setAttribute('data-id', pais[i].id);

        el.style.display = 'none';
        changeBtnStates('add');

    }

    //***************** */

    return (
        <div className={styles.containerEstados}>
            <h3 className="fa fa-city fa-3x"> Estado</h3>
            <form onSubmit={handleSubmit}>
                {
                    <>
                        <div className={styles.containerFields}>

                            
                            <input type="text" style={{display:'none'}}  value={estados.id > 0 ? estados.id : 0} data-field="id" onChange={handleChange} />


                            <label>Estado:</label>
                            <input type="text" defaultValue={estados.estado} data-field="estados" onChange={handleChange} />

                            <label>Uf:</label>
                            <input type="text" defaultValue={estados.uf} data-field="uf" onChange={handleChange} />

                            <label>País:</label>
                            <div>
                                <input type="text" style={{width:'calc(100% - 34px)'}} defaultValue={estados.pais} disabled data-field="pais" data-id={estados.idpais} onChange={handleChange} />
                                <button type="button" className='fas fa-search' onClick={openSearchPais}></button>
                            </div>



                        </div>
                        <div className={styles.containerBtns}>
                            <button type="submit" title="Salvar" className={"fas fa-save fa-2x " + styles.clsdisabled} />
                            <button type="button" title="Deletar" className="fas fa-trash-alt fa-2x" onClick={onBtnDel}></button>
                            <button type="button" title="Cancelar" className={"fas fa-ban fa-2x " + styles.clsdisabled} onClick={onBtnCancel} ></button>
                            <button type="button" title="Voltar" className="fas fa-arrow-circle-left fa-2x " onClick={onBtnBack}></button>
                        </div>
                    </>
                }
            </form>
            <div className={styles.containerPesquisaPais} style={{ display: 'none' }}>
                <div className={styles.containerPesquisaListagemUser}>
                    <div className={styles.containerSearchBtn}>
                        <input type="seacrh" placeholder="pesquisar: País" onInput={seachPais} />
                        <button className="fas fa-times-circle" onClick={closeSearchPais}></button>
                    </div>
                    <div >
                        <ul>
                            {
                                pais.map((item, index) => {
                                    return (
                                        <li key={item.id} data-index={index} data-pais={item.pais} onClick={clickPais}>
                                            <span>País: {item.pais}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );

}