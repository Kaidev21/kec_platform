<script setup>
/** En-tête public : logo, navigation, langue, accès Connexion. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import KecLogo from '@/components/brand/KecLogo.vue'
import KButton from '@/components/ui/KButton.vue'
import LangSwitcher from './LangSwitcher.vue'
import { useAuthStore, HOME_BY_ROLE } from '@/stores/auth'

const auth = useAuthStore()
const scrolled = ref(false)
const menu = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 30 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="hdr" :class="{ scrolled, open: menu }">
    <div class="container bar">
      <RouterLink to="/" class="brand" :aria-label="$t('nav.home')" @click="menu = false"><KecLogo :size="40" /></RouterLink>

      <nav class="nav" :aria-label="$t('nav.main')">
        <RouterLink :to="{ name: 'home', hash: '#programme' }" @click="menu = false">{{ $t('nav.program') }}</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#services' }" @click="menu = false">{{ $t('nav.services') }}</RouterLink>
        <RouterLink :to="{ name: 'waiting-room' }" @click="menu = false">{{ $t('nav.waitingRoom') }}</RouterLink>
        <RouterLink :to="{ name: 'kopen-mind' }" @click="menu = false">Kopen Mind</RouterLink>
      </nav>

      <div class="actions">
        <LangSwitcher />
        <KButton v-if="auth.isAuthenticated" variant="wood" size="sm" :icon="false" :to="{ name: HOME_BY_ROLE[auth.role] }">{{ $t('nav.mySpace') }}</KButton>
        <KButton v-else variant="cowrie" size="sm" :to="{ name: 'login' }">{{ $t('nav.connexion') }}</KButton>
        <button class="burger" type="button" :aria-expanded="menu" :aria-label="$t('nav.menu')" @click="menu = !menu"><span /><span /><span /></button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.hdr {
  position: fixed; inset: 0 0 auto; z-index: 100; padding: 1rem 0;
  transition: background .4s, padding .4s, box-shadow .4s;
}
.hdr.scrolled, .hdr.open {
  padding: .55rem 0;
  background: rgba(26, 17, 11, .82); backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 1px 0 var(--kec-border);
}
.bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { color: inherit; flex-shrink: 0; }
@media (max-width: 480px) { .brand :deep(.tag) { display: none; } .actions :deep(.k-btn__icon) { display: none; } }
.nav {
  display: none; gap: 2rem;
  a { color: var(--kec-ivory); font-weight: 600; font-size: .93rem; position: relative; padding: .3rem 0; }
  a::after { content: ''; position: absolute; left: 50%; right: 50%; bottom: -2px; height: 2px; background: var(--kec-gold); border-radius: 2px; transition: all .35s var(--ease-out); }
  a:hover::after, a.router-link-exact-active::after { left: 0; right: 0; }
  @include md-up { display: flex; }
}
.actions { display: flex; align-items: center; gap: .6rem; }
.burger {
  display: grid; gap: 5px; padding: .6rem; background: none; border: 0;
  span { width: 22px; height: 2px; background: var(--kec-ivory); border-radius: 2px; transition: all .3s; }
  @include md-up { display: none; }
}
.open .burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.open .burger span:nth-child(2) { opacity: 0; }
.open .burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@include md-down {
  .open .nav {
    display: flex; flex-direction: column; gap: 0; position: absolute; top: 100%; left: 0; right: 0;
    background: rgba(26, 17, 11, .97); padding: .5rem 1.25rem 1.25rem; border-bottom: 1px solid var(--kec-border);
    a { padding: .9rem 0; border-bottom: 1px solid rgba(233, 201, 131, .08); font-size: 1.05rem; }
  }
  .actions :deep(.k-btn) { padding: .45rem .8rem; }
}
</style>
