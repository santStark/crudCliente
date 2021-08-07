import styles from './styles.module.css';
import { api, toDate } from '../../services/api';
import { useRouter } from 'next/router'
import {  useEffect, useState } from 'react';

interface IPais {
    id: number,
    pais: string,

}

export default function Pais() {

    const [pais, setPais] = useState({} as IPais);
    const [isBtnSave, setIsBtnSave] = useState(false);
    const router = useRouter();

    async function getPaisID() {

        const param = String(router.query.pais);
    
        if (param === undefined || param === 'undefined') return;

        const { data } = await api.get('paisID/' + param)
   
        if (data.length === 0) {
            const obj = {} as IPais;
            obj.id = 0;
            obj.pais = ' ';
            data.push(obj);
        }

        setPais(data[0])

    }

    useEffect(() => {

        getPaisID()

    }, [router.query.pais]);

    async function handleSubmit(event:MouseEvent|any) {

        event.preventDefault();

        const el = document.querySelector('.' + styles.containerPais);
     

        const obj = {} as IPais;
        obj.id = el.querySelector('input[data-field="id"]')['value'].trim();
        obj.pais = el.querySelector('input[data-field="pais"]')['value'].trim().substr(0,150);

        const valid = validFields(obj);
        if(!valid.valid) {
            alert(valid.msg);
            return;
        }

        const { data } = await api.post('pais/', obj);

        if(pais.id === 0){
            alert('Pais adicionado!');
            router.back();
            return;
        }

        if (data[0] === 'true') {
            alert('Alteração realizada');
            setIsBtnSave(false);
        }


        changeBtnStates('del');

    }

    function validFields(obj:IPais): {valid:boolean, msg:string} {

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

        el.querySelector('input[data-field="id"]')['value'] = this.id;
        el.querySelector('input[data-field="pais"]')['value'] = this.pais;

    }

    function onBtnBack() {

        router.back();

    }

    async function onBtnDel() {

        if(pais.id === 0) return;

        const { data } = await api.get('delPaisID/' + pais.id);

        if (data[0] === 'true') {

            alert('Exclusão realizada');
            router.back();

        }else{

            alert('Existem dados vinculados a este registro!');
        }

        

    }

    return (
        <div className={styles.containerPais}>
            <h3 className="fa fa-flag fa-3x"> País</h3>
            <form onSubmit={handleSubmit}>
                {
                    <>
                        <div className={styles.containerFields}>

                            
                            <input type="text" style={{display:'none'}}  value={pais.id > 0 ? pais.id : 0} data-field="id" onChange={handleChange} />


                            <label>País:</label>
                            <input type="text" defaultValue={pais.pais} data-field="pais" onChange={handleChange} />


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
        </div>
    );

}