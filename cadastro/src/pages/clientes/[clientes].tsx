import styles from './styles.module.css';
import { api, toDate } from '../../services/api';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

interface IClientes {
    id: number,
    nome: string,
    sexo: string,
    dataNasc: string,
    endereco: string,
    cidade: string,
    idcidade:number,
    ativo: boolean

}

export default function Clientes() {

    const [clientes, setClientes] = useState({} as IClientes);
    const [cidades, setCidades] = useState([]);
    const [isBtnSave, setIsBtnSave] = useState(false);
    const router = useRouter();

    async function getClientesID() {

        const param = String(router.query.clientes);

        if (param === undefined || param === 'undefined') return;

        const { data } = await api.get('clienteID/' + param)

        if (data.length === 0) {
            const obj = {} as IClientes;
            obj.id = 0;
            obj.nome = ' ';
            obj.sexo = ' ';
            obj.dataNasc = '1990-01-01';
            obj.endereco = ' ';
            obj.cidade = ' ';
            obj.idcidade = 0;
            obj.ativo = true;
            data.push(obj);
        }else{
            data[0].dataNasc = data[0].dataNasc.substr(0,10);
            data[0].ativo = data[0].ativo === 1;
        }

        setClientes(data[0])

    }

    async function getCidades() {

        const { data } = await api.get('cidades');
        if (data.length === 0) return;

        setCidades(data);

    }

    useEffect(() => {

        getClientesID();
        getCidades();

    }, [router.query.clientes]);

    async function handleSubmit(event: MouseEvent | any) {

        event.preventDefault();

        const el = document.querySelector('.' + styles.containerClientes);

        const obj = {} as IClientes;
        obj.id = el.querySelector('input[data-field="id"]')['value'].trim();
        obj.nome = el.querySelector('input[data-field="nome"]')['value'].trim().substr(0, 150);
        obj.sexo = el.querySelector('select[data-field="sexo"]')['value'].trim().substr(0, 1);
        obj.dataNasc = el.querySelector('input[data-field="dtnasc"]')['value'].trim();
        obj.endereco = el.querySelector('input[data-field="endereco"]')['value'].trim().substr(0, 150);
        obj.cidade = el.querySelector('input[data-field="cidade"]').getAttribute('data-id');
        obj.ativo = el.querySelector('input[data-field="ativo"]')['checked'];

        if(obj.cidade === '0') obj.cidade = '';

        const valid = validFields(obj);
        if(!valid.valid) {
            alert(valid.msg);
            return;
        }

        const { data } = await api.post('cliente/', obj);

        if (clientes.id === 0) {
            alert('Cliente adicionado!');
            router.back();
            return;
        }

        if (data[0] === 'true') {
            alert('Alteração realizada');
            setIsBtnSave(false);
        }


        changeBtnStates('del');

    }

    function validFields(obj:IClientes): {valid:boolean, msg:string} {

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

    function handleChange(event: MouseEvent | any) {

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

        el.querySelector('input[data-field="id"]')['value'] = clientes.id;
        el.querySelector('input[data-field="nome"]')['value'] = clientes.nome;
        el.querySelector('select[data-field="sexo"]')['value'] = clientes.sexo;
        el.querySelector('input[data-field="dtnasc"]')['value'] = clientes.dataNasc;
        el.querySelector('input[data-field="endereco"]')['value'] = clientes.endereco;
        el.querySelector('input[data-field="cidade"]').setAttribute('data-id', clientes.idcidade.toString()) ;
        el.querySelector('input[data-field="cidade"]')['value'] = clientes.cidade ;
        el.querySelector('input[data-field="ativo"]')['checked'] = clientes.ativo;

    }

    function onBtnBack() {

        router.back();

    }

    async function onBtnDel() {

        if (clientes.id === 0) return;

        const { data } = await api.get('delClienteID/' + clientes.id);

        if (data[0] === 'true') {

            alert('Exclusão realizada');

        }

        router.back();

    }

    //***************** */

    function openSearchCidades() {

        const el = (document.querySelector('.' + styles.containerPesquisaCidades) as HTMLElement);
        if (!el) return;

        el.style.display = '';

    }

    function seachCidades(e) {

        const v = e.target.value.toUpperCase();
        const el = document.querySelector('.' + styles.containerPesquisaCidades + ' ul');

        if (!el) return;

        Array.from(el.querySelectorAll('li')).forEach((item) => {

            const p = item.getAttribute('data-cidade').toUpperCase();
            item.style.display = '';
            if (!p || p.indexOf(v) < 0) item.style.display = 'none';


        })
    }

    function closeSearchCidades() {
        const el = (document.querySelector('.' + styles.containerPesquisaCidades) as HTMLElement);
        if (!el) return;
        el.style.display = 'none';
    }

    function clickCidade(e) {

        const li = e.target.closest('li');
        if (!li) return;

        const i = li.getAttribute('data-index');
        const el = (document.querySelector('.' + styles.containerPesquisaCidades) as HTMLElement);
        const fi = document.querySelector('.' + styles.containerFields);

        if (!i || !el || !fi) return;

        const input = fi.querySelector('input[data-field="cidade"]');

        if (!input) return;

        input['value'] = cidades[i].estado;
        input.setAttribute('data-id', cidades[i].id);

        el.style.display = 'none';
        changeBtnStates('add');

    }

    //***************** */

    return (
        <div className={styles.containerClientes}>
            <h3 className="fa fa-building fa-3x"> Cidade</h3>
            <form onSubmit={handleSubmit}>
                {
                    <>
                        <div className={styles.containerFields}>


                            <input type="text" style={{ display: 'none' }} value={clientes.id > 0 ? clientes.id : 0} data-field="id" onChange={handleChange} />


                            <label>Nome:</label>
                            <input type="text" defaultValue={clientes.nome} data-field="nome" onChange={handleChange} />

                            <label>Sexo:</label>
                            <select data-field="sexo" value={clientes.sexo} onChange={handleChange} >
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                            
                            <label>Data Nasc.:</label>
                            <input type="date" defaultValue={clientes.dataNasc} data-field="dtnasc" onChange={handleChange} />

                            <label>Endereço:</label>
                            <input type="text" defaultValue={clientes.endereco} data-field="endereco" onChange={handleChange} />

                            <label>Cidade:</label>
                            <div>
                                <input type="text" style={{ width: 'calc(100% - 34px)' }} defaultValue={clientes.cidade} disabled data-field="cidade" data-id={clientes.idcidade} onChange={handleChange} />
                                <button type="button" className='fas fa-search' onClick={openSearchCidades}></button>
                            </div>

                            <label>Ativo:</label>
                            <input type="checkbox" defaultChecked={clientes.ativo} data-field="ativo" onClick={handleChange} />



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
            <div className={styles.containerPesquisaCidades} style={{ display: 'none' }}>
                <div className={styles.containerPesquisaListagemUser}>
                    <div className={styles.containerSearchBtn}>
                        <input type="seacrh" placeholder="pesquisar: cidade" onInput={seachCidades} />
                        <button className="fas fa-times-circle" onClick={closeSearchCidades}></button>
                    </div>
                    <div >
                        <ul>
                            {
                                cidades.map((item, index) => {
                                    return (
                                        <li key={item.id} data-index={index} data-cidade={item.cidade} onClick={clickCidade}>
                                            <span>Estado: {item.cidade}</span>
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