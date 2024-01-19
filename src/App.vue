<template>
  <body>
    <Header />
    <router-view />
    <Footer />
  </body>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  async created() {
  }
}
</script>

<style></style>
