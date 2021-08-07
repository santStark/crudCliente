import styles from './styles.module.css';
import { api, toDate } from '../../services/api';
import { useRouter } from 'next/router'
import {  useEffect, useState } from 'react';

interface ICidades {
    id: number,
    estado: string,
    cidade: string,
    idestado:number;

}

export default function Cidades() {

    const [cidades, setCidades] = useState({} as ICidades);
    const [estados, setEstados] = useState([]);
    const [isBtnSave, setIsBtnSave] = useState(false);
    const router = useRouter();

    async function getCidadesID() {

        const param = String(router.query.cidades);
    
        if (param === undefined || param === 'undefined') return;

        const { data } = await api.get('cidadeID/' + param)
   
        if (data.length === 0) {
            const obj = {} as ICidades;
            obj.id = 0;
            obj.estado = ' ';
            obj.cidade = ' ';
            obj.idestado = 0;
            data.push(obj);
        }

        setCidades(data[0])

    }

    async function getEstados() {

        const { data } = await api.get('estados');
        if (data.length === 0) return;

        setEstados(data);

    }

    useEffect(() => {

        getCidadesID();
        getEstados();

    }, [router.query.cidades]);

    async function handleSubmit(event:MouseEvent|any) {

        event.preventDefault();

        const el = document.querySelector('.' + styles.containerCidades);

        const obj = {} as ICidades;
        obj.id = el.querySelector('input[data-field="id"]')['value'].trim();
        obj.cidade = el.querySelector('input[data-field="cidades"]')['value'].trim().substr(0,150);
        obj.estado = el.querySelector('input[data-field="estado"]').getAttribute('data-id');

        if(obj.estado === '0') obj.estado = '';

        const valid = validFields(obj);
        if(!valid.valid) {
            alert(valid.msg);
            return;
        }

        const { data } = await api.post('cidade/', obj);

        if(cidades.id === 0){
            alert('Cidade adicionada!');
            router.back();
            return;
        }

        if (data[0] === 'true') {
            alert('Alteração realizada');
            setIsBtnSave(false);
        }


        changeBtnStates('del');

    }

    function validFields(obj:ICidades): {valid:boolean, msg:string} {

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

        el.querySelector('input[data-field="id"]')['value'] = cidades.id;
        el.querySelector('input[data-field="cidades"]')['value'] = cidades.cidade;
        el.querySelector('input[data-field="estado"]')['value'] = cidades.estado;
        el.querySelector('input[data-field="estado"]').setAttribute('data-id', cidades.idestado.toString())

    }

    function onBtnBack() {

        router.back();

    }

    async function onBtnDel() {

        if(cidades.id === 0) return;

        const { data } = await api.get('delCidadeID/' + cidades.id);

        if (data[0] === 'true') {

            alert('Exclusão realizada');

        }

        router.back();

    }

    //***************** */

    function openSearchEstados() {

        const el = (document.querySelector('.' + styles.containerPesquisaEstados) as HTMLElement);
        if (!el) return;

        el.style.display = '';

    }

    function seachEstados(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerPesquisaEstados + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-estado').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    function closeSearchEstado() {
        const el = (document.querySelector('.' + styles.containerPesquisaEstados) as HTMLElement);
        if (!el) return;
        el.style.display = 'none';
    }

    function clickEstado(e) {

        const li = e.target.closest('li');
        if(!li) return;
        
        const i = li.getAttribute('data-index');
        const el = (document.querySelector('.' + styles.containerPesquisaEstados) as HTMLElement);
        const fi = document.querySelector('.' + styles.containerFields);

        if (!i || !el || !fi) return;

        const input = fi.querySelector('input[data-field="estado"]');

        if (!input) return;

        input['value'] = estados[i].estado;
        input.setAttribute('data-id', estados[i].id);

        el.style.display = 'none';
        changeBtnStates('add');

    }

    //***************** */

    return (
        <div className={styles.containerCidades}>
            <h3 className="fa fa-building fa-3x"> Cidade</h3>
            <form onSubmit={handleSubmit}>
                {
                    <>
                        <div className={styles.containerFields}>

                            
                            <input type="text" style={{display:'none'}}  value={cidades.id > 0 ? cidades.id : 0} data-field="id" onChange={handleChange} />


                            <label>Cidade:</label>
                            <input type="text" defaultValue={cidades.cidade} data-field="cidades" onChange={handleChange} />

                            <label>Estado:</label>
                            <div>
                                <input type="text" style={{width:'calc(100% - 34px)'}} defaultValue={cidades.estado} disabled data-field="estado" data-id={cidades.idestado} onChange={handleChange} />
                                <button type="button" className='fas fa-search' onClick={openSearchEstados}></button>
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
            <div className={styles.containerPesquisaEstados} style={{ display: 'none' }}>
                <div className={styles.containerPesquisaListagemUser}>
                    <div className={styles.containerSearchBtn}>
                        <input type="seacrh" placeholder="pesquisar: estado" onInput={seachEstados} />
                        <button className="fas fa-times-circle" onClick={closeSearchEstado}></button>
                    </div>
                    <div >
                        <ul>
                            {
                                estados.map((item, index) => {
                                    return (
                                        <li key={item.id} data-index={index} data-estado={item.Estados} onClick={clickEstado}>
                                            <span>Estado: {item.estado}</span>
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