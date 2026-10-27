<script setup>
/** Pied de page : frise bogolan, liens vers les espaces Kia et Équipe. */
import KecLogo from '@/components/brand/KecLogo.vue'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="ftr">
    <div class="frieze" aria-hidden="true" />
    <div class="container grid-f">
      <div>
        <KecLogo :size="46" />
        <p class="text-muted mission">{{ $t('footer.mission') }}</p>
      </div>
      <div>
        <h4>{{ $t('footer.explore') }}</h4>
        <RouterLink :to="{ name: 'home', hash: '#programme' }">{{ $t('nav.program') }}</RouterLink>
        <RouterLink :to="{ name: 'waiting-room' }">{{ $t('nav.waitingRoom') }}</RouterLink>
        <RouterLink :to="{ name: 'kopen-mind' }">Kopen Mind</RouterLink>
      </div>
      <div>
        <h4>{{ $t('footer.spaces') }}</h4>
        <RouterLink :to="{ name: 'login' }">{{ $t('footer.fellows') }}</RouterLink>
        <RouterLink :to="{ name: 'investor-login' }">{{ $t('footer.kia') }}</RouterLink>
        <RouterLink :to="{ name: 'staff-login' }">{{ $t('footer.team') }}</RouterLink>
      </div>
      <div>
        <h4>{{ $t('footer.contact') }}</h4>
        <span class="text-muted">Douala · Yaoundé · Edéa</span>
        <a href="mailto:contact@kec.africa">contact@kec.africa</a>
        <span class="text-muted">WhatsApp · LinkedIn · Facebook</span>
      </div>
    </div>
    <div class="container legal">
      <span>© {{ year }} K-Enterprise Counsel</span>
      <span>{{ $t('footer.disclaimer') }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.ftr { position: relative; padding: 0 0 6.5rem; background: linear-gradient(#1a110b, #120b07); margin-top: 4rem; }
.frieze {
  height: 26px; margin-bottom: 3.5rem; opacity: .85;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='26'%3E%3Crect width='52' height='26' fill='%23a8401f'/%3E%3Cpath d='M0 13h8l5-8 5 16 5-16 5 16 5-16 5 8h14' stroke='%231a110b' stroke-width='2.2' fill='none'/%3E%3Ccircle cx='46' cy='6' r='1.6' fill='%23f5ecdb'/%3E%3Ccircle cx='46' cy='20' r='1.6' fill='%23f5ecdb'/%3E%3C/svg%3E") repeat-x;
}
.grid-f {
  display: grid; gap: 2rem; grid-template-columns: 1fr;
  @include sm-up { grid-template-columns: 1fr 1fr; }
  @include md-up { grid-template-columns: 1.6fr 1fr 1fr 1fr; }
  > div { display: flex; flex-direction: column; gap: .5rem; }
  h4 { font-family: var(--font-body); font-size: .78rem; letter-spacing: .2em; text-transform: uppercase; color: var(--kec-gold); margin-bottom: .4rem; }
  a { color: var(--kec-ivory); font-size: .92rem; &:hover { color: var(--kec-gold-soft); } }
}
.mission { max-width: 34ch; margin-top: 1rem; font-size: .92rem; }
.legal { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .75rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--kec-border); font-size: .78rem; color: var(--kec-text-muted); }
</style>
