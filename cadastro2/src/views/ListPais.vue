<template>
  <div class="containerListagem">
    <h3 class="fa fa-flag fa-3x">PAÍS</h3>
    <div class="containerSearch">
      <input type="search" placeholder="pesquisar: Pais" @input="seachPais($event)"/>
      <router-link class="fas fa-plus fa-2x" to="/pais/0"></router-link>
    </div>
    <div class="containerListagemPais">
      <ul>
        <li v-for="pais in paises" :key="pais.id" :data-pais="pais.pais">
          <span>País: {{ pais.pais }}</span>
          <span
            style="display:flex, justifyContent: center, height: 100%, alignItems: center"
          >
            <router-link class="fas fa-search" :to="'/pais/'+pais.id"></router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { api } from "../api/api";

export default {
  name: "ListPais",
  data() {
    return { paises: [{ id: null, pais: null }] };
  },
  methods:{
    seachPais(e){ seachPais.bind(this)(e)}
  },
  created() {
    getPais.bind(this)();
  },
};

async function getPais() {
  const { data } = await api.get("pais");
  setPais.bind(this)(data);
}

function setPais(array) {
  this.paises = array;
}

function seachPais(e) {
  const v = e.target.value.toUpperCase();
  const el = document.querySelector(".containerListagemPais ul");

  if (!el) return;

  Array.from(el.querySelectorAll("li")).forEach((item) => {
    const p = item.getAttribute("data-pais").toUpperCase();
    item.style.display = "";
    if (!p || p.indexOf(v) < 0) item.style.display = "none";
  });
}
</script>

<style scoped>
.containerListagem {
  background: white;
  width: calc(100% - 7rem);
  height: calc(100vh - 3rem);
  border: 1px solid #b1b0b5;
  border-radius: 5px;
  padding: 1rem;
}

.containerListagem h3 {
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
}

.containerSearch {
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.containerSearch input {
  height: 3rem;
  width: calc(90% - 4rem);
  padding: 5px;
  font-size: 1.3rem;
  border: 1px solid #f1efef;
  border-radius: 5px;
  margin-right: 1rem;
  outline: #f1efef;
}

.containerSearch a {
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
}

.containerSearch > a:hover {
  background: #000064;
  color: white;
}

.containerListagemPais {
  width: 100%;
  overflow-y: auto;
  display: flex;
  margin-top: 1rem;
  justify-content: center;
}

.containerListagemPais ul {
  width: 90%;
  min-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

.containerListagemPais li {
  border-bottom: 1px solid #f1efef;
  height: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
}

.containerListagemPais li:first-child {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.containerListagemPais li:hover {
  color: #000064;
  box-shadow: 0px 1px 3px 1px #b9b9b9;
}

.containerListagemPais li a {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid #f1efef;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #efeeee;
  box-shadow: 0px 1px 3px 1px #b9b9b9;
  cursor: pointer;
}

.containerListagemPais a:hover {
  background: #000064;
  color: white;
}

@media (max-width: 720px) {
  .containerListagem {
    width: 100% !important ;
    height: calc(100vh - 7rem) !important;
  }
}
</style>
