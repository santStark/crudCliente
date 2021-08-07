<template>
  <div class="containerPais">
    <h3 class="fa fa-flag fa-3x">País</h3>
    <form @submit="handleSubmit($event)">
      <div class="containerFields">
        <input
          type="text"
          :value="id"
          style="display: none !important"
          data-field="id"
        />

        <label>País:</label>
        <input
          type="text"
          :value="pais"
          @input="handleChange($event)"
          data-field="pais"
        />
      </div>
      <div class="containerBtns">
        <button
          type="submit"
          title="Salvar"
          class="fas fa-save fa-2x clsdisabled"
        />
        <button
          type="button"
          title="Deletar"
          class="fas fa-trash-alt fa-2x"
          @click="btnDel"
        ></button>
        <button
          type="button"
          title="Cancelar"
          class="fas fa-ban fa-2x clsdisabled"
          @click="btnCancel"
        ></button>
        <button
          type="button"
          title="Voltar"
          class="fas fa-arrow-circle-left fa-2x"
          @click="btnBack"
        ></button>
      </div>
    </form>
  </div>
</template>

<script>
import { api } from "../api/api";

export default {
  name: "Pais",
  data() {
    return {
      id: null,
      pais: null,
      isBtnSave: false,
    };
  },
  methods: {
    handleChange(e) {
      e.preventDefault();
      handleChange.bind(this)(e);
    },
    btnCancel(e) {
      e.preventDefault();
      onBtnCancel.bind(this)(e);
    },
    btnDel(e) {
      e.preventDefault();
      onBtnDel.bind(this)(e);
    },
    btnBack(e) {
      e.preventDefault();
      onBtnBack.bind(this)();
    },
    handleSubmit(e){
      e.preventDefault();
      handleSubmit.bind(this)(e);
    }

  },
  created() {
    getPaisID.bind(this)(this.$route.params.id);
  },
};

async function getPaisID(param) {
  if (param === undefined || param === "undefined") return;

  const { data } = await api.get("paisID/" + param);

  if (data.length === 0) {
    const obj = {};
    obj.id = 0;
    obj.pais = " ";
    data.push(obj);
  }

  this.id = data[0].id;
  this.pais = data[0].pais;
}

function handleChange(event) {
  if (this.isBtnSave) return;

  changeBtnStates("add");
  setIsBtnSave.bind(this)(true);
}

function setIsBtnSave(bol) {
  this.isBtnSave = bol;
}

function changeBtnStates(group) {
  const el = document.querySelector(".containerPais");

  if (!el) return;

  const btnSave = el.querySelector(".fa-save");
  const btnDel = el.querySelector(".fa-trash-alt");
  const btnCancel = el.querySelector(".fa-ban");
  const btnBack = el.querySelector(".fa-arrow-circle-left");

  if (group === "add") {
    btnSave.classList.remove("clsdisabled");
    btnCancel.classList.remove("clsdisabled");

    btnDel.classList.add("clsdisabled");
    btnBack.classList.add("clsdisabled");
  } else {
    btnDel.classList.remove("clsdisabled");
    btnBack.classList.remove("clsdisabled");

    btnSave.classList.add("clsdisabled");
    btnCancel.classList.add("clsdisabled");
  }
}

function onBtnCancel() {
  if (!this.isBtnSave) return;

  changeBtnStates("del");

  backValues.bind(this)();
  setIsBtnSave.bind(this)(false);
}

function backValues() {
  const el = document.querySelector(".containerPais .containerFields");

  if (!el) return;

  el.querySelector('input[data-field="id"]')["value"] = this.id;
  el.querySelector('input[data-field="pais"]')["value"] = this.pais;
}

async function onBtnDel() {
  if (this.id === 0) return;

  const { data } = await api.get("delPaisID/" + this.id);

  if (data[0] === "true") {

    alert("Exclusão realizada");
    this.$router.push("/listPais");

  } else {
    alert("Existem dados vinculados a este registro!");
  }
}

function onBtnBack() {
  this.$router.push("/listPais");
}

async function handleSubmit(event) {
  event.preventDefault();

  const el = document.querySelector('.containerPais .containerFields');

  const obj = {};
  obj.id = el.querySelector('input[data-field="id"]')["value"].trim();
  obj.pais = el
    .querySelector('input[data-field="pais"]')
    ["value"].trim()
    .substr(0, 150);

  const valid = validFields(obj);
  if (!valid.valid) {
    alert(valid.msg);
    return;
  }

  const { data } = await api.post("pais/", obj);

  if (this.id === 0) {
    alert("Pais adicionado!");
    this.$router.push("/listPais");
    return;
  }

  if (data[0] === "true") {
    alert("Alteração realizada");
    setIsBtnSave.bind(this)(false);
  }

  changeBtnStates("del");
}

function validFields(obj) {
  let ret = { valid: true, msg: "" };

  Object.keys(obj).forEach((item) => {
    if (!ret.valid) return;

    if (obj[item] === "") {
      ret.valid = false;
      ret.msg = `O campo ${item} é obrigatório!`;
    }
  });

  return ret;
}
</script>



<style scoped>
.containerPais {
  background: white;
  width: calc(100% - 7rem);
  height: calc(100vh - 3rem);
  border: 1px solid #b1b0b5;
  border-radius: 5px;
  padding: 1rem;
}

.containerPais h3 {
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
}

.containerPais form {
  width: 100%;
  margin-top: 2rem;
}

.containerPais form {
  width: 100%;
}

.containerFields {
  width: 100%;
  min-height: 300px;
  display: grid;
  grid-template-columns: 1fr 9fr;
  grid-template-rows: 40px;
  column-gap: 0.5rem;
  row-gap: 0.7rem;
}

.containerFields label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.containerFields input {
  border: 1px solid #dddbdb;
  outline: #dddbdb;
  padding: 5px;
  border-radius: 5px;
}

.containerBtns {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.containerBtns button {
  width: 3rem;
  height: 3rem;
  border-radius: 5px;
  border: 1px solid #f1efef;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #efeeee;
  box-shadow: 0px 1px 3px 1px #b9b9b9;
  cursor: pointer;
  margin-right: 0.7rem;
}

.containerBtns button.clsdisabled {
  opacity: 0.5 !important;
  pointer-events: none !important;
}

.containerBtns button:not(.clsdisabled):hover {
  background: #000064 !important;
  color: white !important;
}

@media (max-width: 720px) {
  .containerPais {
    width: 100% !important ;
    height: calc(100vh - 7rem) !important;
  }
}
</style>
