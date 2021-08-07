<template>
  <div class="containerMenu">
    <router-link class="fa fa-home fa-2x" to="/" ></router-link>
    <router-link class="fa fa-user fa-2x" to="/" ></router-link>
    <router-link class="fas fa-flag fa-2x" to="/listPais" ></router-link>
    <router-link class="fas fa-city fa-2x" to="/" ></router-link>
    <router-link class="fas fa-building fa-2x" to="/" ></router-link>
  </div>
</template>

<script>
export default {
  name: "Menu",
  

};

</script>

<style scoped>
.containerMenu {
  background: white;
  width: 6rem;
  height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  margin-right: 0.5rem;
  border: 1px solid #b1b0b5;
}

.containerMenu > a {
  width: 4rem;
  height: 4rem;
  border: 1px solid #f1efef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #efeeee;
  box-shadow: 0px 1px 3px 1px #b9b9b9;
  margin-top: 1rem;
  color: #666666;
}

.containerMenu > a:hover {
  background: #000064;
  color: white;
}
.activeMenu {
  background: #000064 !important;
  color: white!important;
}

@media (max-width: 720px) {
  .containerMenu {
    flex-direction: row;
    width: 100%;
    height: 7rem !important;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .containerMenu > a {
    margin-top: 0;
    margin-left: 0.4rem;
  }
}
</style>

